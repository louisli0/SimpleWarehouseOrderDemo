const pool = require('../Database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ActivityLogService = new (require('./ActivityLog.helper'))();

class UserService {
  constructor() {}

  async verifyAccessToken(accessToken) {
    return new Promise((reject, resolve) => {
      jwt.verify(accessToken, process.env.JWTSECRET, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async verifyRefreshToken(refreshToken) {
    return new Promise((reject, resolve) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESHTOKENSECRET,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  async GenerateJWT(userDetails) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        userDetails,
        process.env.JWTSECRET,
        {
          algorithm: 'HS256',
          expiresIn: '1hr',
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  async GenerateRefresh(userDetails) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        userDetails,
        process.env.REFRESHTOKENSECRET,
        {
          algorithm: 'HS256',
          expiresIn: '24hr',
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  async Register(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      //Does an account exists?
      let accountQuery =
        'SELECT emailaddress FROM "User" WHERE emailaddress = $1';
      const duplicateResult = await client.query(accountQuery, [
        data.emailAddress,
      ]);

      if (duplicateResult.rows.length > 0) {
        console.log('Duplicate account found');
        await client.query('ROLLBACK');
        return false;
      }

      let registerQuery =
        'INSERT INTO "User"(emailaddress, firstname, lastname) VALUES($1, $2, $3) RETURNING id';
      const result = await client.query(registerQuery, [
        data.emailAddress,
        data.firstName,
        data.lastName,
      ]);

      // Hash Password
      const userId = result.rows[0].id;
      const hashed = await bcrypt.hash(data.password, saltRounds);
      let passwordRes = await client.query(
        'UPDATE "User" SET password = $1 WHERE id = $2',
        [hashed, userId]
      );

      // Activity Log
      let userLog =
        'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2,$3)';
      await client.query(userLog, [
        result.rows[0].id,
        'Register',
        `Registered ${userId}`,
      ]);

      if (hashed) {
        await client.query('COMMIT');
        return true;
      } else {
        console.log('Register: Bcrypt did not hash password');
        return false;
      }
    } catch (err) {
      console.log('Register Error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async Login(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let loginQuery =
        'SELECT id, emailaddress, password, lastlogindate FROM "User" WHERE emailaddress = $1';
      const result = await client.query(loginQuery, [data.emailAddress]);

      if (result.rows.length != 1) {
        console.log('No matching users');
        await client.query('ROLLBACK');
        return false;
      }

      const hash = result.rows[0].password;
      const userId = result.rows[0].id;
      const lastLogin = result.rows[0].lastlogindate;

      // Staff role?
      let isStaff = false;
      let staffQuery = 'SELECT id FROM Staff WHERE UserId = $1';
      const staffResult = await client.query(staffQuery, [userId]);
      if (staffResult.rows.length == 1) {
        isStaff = true;
      }

      var verification = bcrypt.compare(data.password, hash);
      if (verification) {
        // Update Last Login time
        let loginDateQuery =
          'UPDATE "User" SET lastlogindate = NOW() WHERE Id = $1';
        const result = await pool.query(loginDateQuery, [userId]);

        let accessToken = await this.GenerateJWT({ userId: userId });
        let refreshToken = await this.GenerateRefresh({ userId: userId });

        const data = {
          uID: userId,
          lastLoginDate: lastLogin,
          access: accessToken,
          refresh: refreshToken,
          role: isStaff == true ? 'Staff' : 'User',
        };

        let refreshTokenQuery =
          'INSERT INTO RefreshTokens(userid, refreshtoken) VALUES($1, $2)';
        await client.query(refreshTokenQuery, [userId, refreshToken]);

        //  Activity log
        let userLog =
          'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2,$3)';
        await client.query(userLog, [
          userId,
          'Login',
          'Successfully logged in',
        ]);

        await client.query('COMMIT');
        return data;
      } else {
        //  Activity log
        let userLog =
          'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2,$3)';
        await client.query(userLog, [
          result.rows[0].id,
          'Login',
          'Failed to log in',
        ]);
        await client.query('COMMIT');
        return false;
      }
    } catch (err) {
      console.log('Login Error', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async Refresh(data) {
    const client = await pool.connect();
    try {
      let refreshQuery =
        'SELECT refreshtoken, isvalid, isexpired FROM refreshtokens WHERE userid = $1 AND refreshtoken = $2';
      let refreshQueryRes = await client.query(refreshQuery, [
        data.userId,
        data.refreshToken,
      ]);

      if (refreshQueryRes.rows[0] != undefined) {
        if (
          refreshQueryRes.rows[0].IsValid == false ||
          refreshQueryRes.rows[0].IsExpired
        ) {
          console.log('Refresh token expired or already used');
          return false;
        }

        var result = jwt.verify(
          data.refreshToken,
          process.env.REFRESHTOKENSECRET,
          (err, decoded) => {
            if (err) throw err;
            return decoded;
          }
        );

        console.log('Refresh token verification', result);

        if (result.exp < Math.floor(new Date().getTime() / 1000.0)) {
          console.log('Refresh token is invalid');
          return false;
        }

        if (result.exp != undefined) {
          let accessToken = await this.GenerateJWT({ userId: data.userId });
          let refreshToken = await this.GenerateRefresh({
            userId: data.userId,
          });
          console.log('Newly Generated tokens', accessToken, refreshToken);

          // Invalidate and log action
          let refreshQuery =
            'UPDATE RefreshTokens SET IsValid = false, IsExpired = true WHERE Id = $1';
          let updateRefreshTokenRow = await client.query(refreshQuery, [
            refreshQueryRes.rows[0].id,
          ]);

          // Activity Log
          let userLog =
            'INSERT INTO ActivityLog("User", type, description) VALUES($1, $2,$3)';
          await client.query(userLog, [
            data.userId,
            'Login',
            'Refresh token login',
          ]);

          const returnToClient = {
            uID: data.userId,
            access: accessToken,
            refresh: refreshToken,
          };
          return returnToClient;
        }
      }
      console.log('end of function');
      return false;
    } catch (err) {
      console.log('Refresh token error', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async GetById(id) {
    try {
      var {
        rows,
      } = await pool.query(
        'SELECT id, emailaddress, firstname, lastname, lastlogindate FROM "User" WHERE Id = $1',
        [id]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  async Logout(data) {
    const client = await pool.connect();
    try {
      client.query('BEGIN');

      // Find Refresh Tokens
      const refreshQuery =
        'SELECT id FROM refreshtokens WHERE refreshtoken = $1 and userid = $2';
      const { rows } = await client.query(refreshQuery, [
        data.data.refreshToken,
        data.data.uId,
      ]);

      // Invalidate current token.
      if (rows.length > 0) {
        const invalidateToken =
          'UPDATE refreshtokens SET (isvalid, isexpired) = (true, true) WHERE id = $1';
        await client.query(invalidateToken, [rows[0].id]);
      }

      // Log logout action
      await ActivityLogService.CreateEntry({
        userId: rows[0].userid,
        type: 'Logout',
        description: 'Logged out',
      });
      await client.query('COMMIT');
      return true;
    } catch (err) {
      client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = UserService;
