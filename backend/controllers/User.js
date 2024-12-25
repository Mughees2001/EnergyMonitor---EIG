import { User } from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import http from "http";
import csv from "csv-parser";
import axios from "axios";
import cheerio from "cheerio";

export const register = async (req, res) => {
  try {
    const { name, email, password, username, phoneNumber, referenceNumber, meterID } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user = await User.create({
      name,
      email,
      password,
      username,
      phoneNumber,
      referenceNumber,
      meterID,
      otp,
      otp_expires: new Date(Date.now() + process.env.OTP_EXPIRE * 1000),
    });

    await sendMail(email, "OTP for registration", `Your OTP is ${otp}`);

    sendToken(res, user, 201, "OTP sent to your email, verify your email");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await User.findById(req.user._id);

    if (user.otp !== otp || user.otp_expires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or OTP expired",
      });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expires = null;

    await user.save();

    sendToken(res, user, 200, "Email verified successfully");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both username and password",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendToken(res, user, 200, "Login Sucessful");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password use case implementation
export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please enter both current and new password" });
    }

    // Check if the current password provided by the user matches the password in the database
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Update the user's password with the new password and save it to the database
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000;
    await user.save();

    await sendMail(email, "OTP for password reset", `Your OTP is ${otp}`);

    res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const verifyResetPasswordOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ resetPasswordOTP: otp, resetPasswordExpires: { $gt: Date.now() } }).select("+password");

    if (!user) {
      return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    }

    res.status(200).json({ message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const historicalBill = async (req, res) => {
  try {
    const { referenceNumber } = req.body;
    const [twoDigit, fiveDigit, sevenDigit, ruralUrban] = referenceNumber.split("-");
    const url = `http://www.lesco.gov.pk/modules/customerbill/History.asp?nBatchNo=${twoDigit}&nSubDiv=${fiveDigit}&nRefNo=${sevenDigit}&strRU=${ruralUrban}`;

    // axios
    //   .get(url)
    //   .then((response) => {
    //     const $ = cheerio.load(response.data);
    //     const tableRows = $("#ContentPane table tr");
    //     const tableHeaders = tableRows
    //       .eq(0)
    //       .find("td")
    //       .map((i, el) => $(el).text().trim())
    //       .get();
    //     const tableData = tableRows
    //       .slice(1)
    //       .map((i, el) => {
    //         return $(el)
    //           .find("td")
    //           .map((i, td) => $(td).text().trim())
    //           .get();
    //       })
    //       .get();
    //     const HistoricalBill = { headers: tableHeaders, data: tableData };
    //     return res.status(200).json({ message: HistoricalBill });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    http
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const $ = cheerio.load(data);
          const tableRows = $("#ContentPane table tr");
          const tableHeaders = tableRows
            .eq(0)
            .find("td")
            .map((i, el) => $(el).text().trim())
            .get();
          const tableData = tableRows
            .slice(1)
            .map((i, el) => {
              return $(el)
                .find("td")
                .map((i, td) => $(td).text().trim())
                .get();
            })
            .get();
          const HistoricalBill = { headers: tableHeaders, data: tableData };
          return res.status(200).json({ message: HistoricalBill });
        });
      })
      .on("error", (error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const accountStatus = async (req, res) => {
  try {
    const { referenceNumber } = req.body;
    const [twoDigit, fiveDigit, sevenDigit, ruralUrban] = referenceNumber.split("-");
    const url = `http://www.lesco.gov.pk/Customer_Reg/AccountStatus.aspx?nBatchNo=${twoDigit}&nSubDiv=${fiveDigit}&nRefNo=${sevenDigit}&strRU=${ruralUrban}`;

    // axios
    //   .get(url)
    //   .then((response) => {
    //     const $ = cheerio.load(response.data);
    //     const tableRows = $("#ContentPane table tr");
    //     const AccountStatus = tableRows.toArray().map((row) => {
    //       return $(row)
    //         .find("td")
    //         .toArray()
    //         .map((cell) => $(cell).text());
    //     });

    //     const usefulStatus = [
    //       AccountStatus[4],
    //       AccountStatus[6],
    //       AccountStatus[7],
    //       AccountStatus[8],
    //       AccountStatus[9],
    //       AccountStatus[12],
    //       AccountStatus[13],
    //       AccountStatus[16],
    //     ];

    //     return res.status(200).json({ success: true, message: usefulStatus });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    http
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const $ = cheerio.load(data);
          const tableRows = $("#ContentPane table tr");
          const AccountStatus = tableRows.toArray().map((row) => {
            return $(row)
              .find("td")
              .toArray()
              .map((cell) => $(cell).text());
          });

          const usefulStatus = [
            AccountStatus[4],
            AccountStatus[6],
            AccountStatus[7],
            AccountStatus[8],
            AccountStatus[9],
            AccountStatus[12],
            AccountStatus[13],
            AccountStatus[16],
          ];

          return res.status(200).json({ success: true, message: usefulStatus });
        });
      })
      .on("error", (error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const changeName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+name");
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({
        success: false,
        message: "Please enter field.",
      });
    }

    user.name = newName;
    await user.save();

    return res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeReferenceNumber = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+referenceNumber");
    const { newReferenceNumber } = req.body;

    if (!newReferenceNumber) {
      return res.status(400).json({
        success: false,
        message: "Please enter field.",
      });
    }

    user.referenceNumber = newReferenceNumber;
    await user.save();

    return res.status(200).json({ message: "Reference number updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const changeMeterID = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+meterID");
    const { newMeterID } = req.body;

    if (!newMeterID) {
      return res.status(400).json({
        success: false,
        message: "Please enter field.",
      });
    }

    user.meterID = newMeterID;
    await user.save();

    return res.status(200).json({ message: "Meter ID updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const smartMeter = async (req, resp) => {
  const { meterID, s, n, w } = req.body;
  const url = `http://egauge${meterID}.egaug.es/cgi-bin/egauge-show?E&c&S&s=${s}&n=${n}&w=${w}&C&Z=LST-5`;
  const url2 = `https://egauge${meterID}.egaug.es/cgi-bin/egauge-show?E&c&S&s=${s}&n=${n}&w=${w}&C&Z=LST-5`;

  try {
    const headers = [];
    const results = [];
    try {
      // try to get data using http
      http.get(url, (res) => {
        res.on("data", (data) => {
          headers.push(data);
        });

        res
          .pipe(csv())
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            console.log(results);

            return resp.status(200).json({ success: true, message: results });
          });
      });
      // Parse CSV data (old way)
      /* res
          .pipe(csv({ headers: true }))
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            console.log(results);
          }); */
    } catch (error) {
      // try to get data using https
      http.get(url2, (res) => {
        res.on("data", (data) => {
          headers.push(data);
        });

        res
          .pipe(csv())
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            console.log(results);

            return resp.status(200).json({ success: true, message: results });
          });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const darkMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+darkMode");
    const { value } = req.body;

    user.darkMode = value;
    await user.save();

    return res.status(200).json({ message: "Dark mode updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
