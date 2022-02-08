/* eslint-disable max-len */
import * as functions from "firebase-functions";
import axios from "axios";


export const instagramVerify = functions.https.onRequest(async (req, res) => {
  const {code} = req.query;
  const clientId=functions.config().instagram.client_id;
  const clientSecret=functions.config().instagram.client_secret;
  const redirectUri=functions.config().instagram.redirect_uri;

  const payload = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${redirectUri}instagram-verify/&code=${code}`;
  const longLivedUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=`;
  const userDetailsUrl = "https://graph.instagram.com/v12.0/me?fields=account_type,id,media_count,username&access_token=";

  try {
    const shortLivedResp = await axios.post("https://api.instagram.com/oauth/access_token", payload);
    const longLivedResp = await axios.get(longLivedUrl+shortLivedResp.data.access_token);
    const userDetailsResp = await axios.get(userDetailsUrl+longLivedResp.data.access_token);
    userDetailsResp.data["access_token"] = longLivedResp.data.access_token;
    userDetailsResp.data["token_type"] = longLivedResp.data.token_type;
    userDetailsResp.data["expires_in"] = longLivedResp.data.expires_in;
    res.status(200).json(userDetailsResp.data);
  } catch (error) {
    const message = error?.response?.data || error?.message;
    const statusCode = message.code || 400;
    res.status(statusCode).json(message);
  }
});


export const facebookVerify = functions.https.onRequest(async (req, res) => {
  const {code} = req.query;
  const clientId=functions.config().facebook.client_id;
  const clientSecret=functions.config().facebook.client_secret;
  const redirectUri=functions.config().facebook.redirect_uri;

  const payload = `client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${code}`;
  const permissionList = ["email", "read_insights", "pages_show_list", "instagram_basic", "instagram_manage_insights", "pages_read_engagement", "public_profile"];
  try {
    const longLivedResp = await axios.get("https://graph.facebook.com/v12.0/oauth/access_token?"+payload);
    const verifyPermissions = await axios.get("https://graph.facebook.com/v12.0/me/permissions?access_token="+longLivedResp.data.access_token);

    let message = "[";
    let missingPermissions = 0;
    verifyPermissions.data.data.forEach((permissionItem: { [x: string]: string; }) => {
      if (permissionList.includes(permissionItem["permission"]) && permissionItem["status"] == "declined") {
        missingPermissions = 1;
        message += permissionItem["permission"]+",";
      }
    });
    message+="] is missing";
    // eslint-disable-next-line no-throw-literal
    if (missingPermissions) throw {message: {error: message}};

    const accountsListResp = await axios.get("https://graph.facebook.com/v12.0/me/accounts?fields=instagram_business_account{username,ig_id},access_token,name,category&access_token="+longLivedResp.data.access_token);
    res.status(200).json(accountsListResp.data);
  } catch (error) {
    const message = error?.response?.data || error?.message;
    const statusCode = message.code || 400;
    res.status(statusCode).json(message);
  }
});
