using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebLineage2.Models;

namespace WebLineage2.Controllers
{
    public class SignupController : Controller
    {
        string connectionString = "server=103.153.68.254; port=3306; uid=root; pwd=;database=l2jmobiusclassic";
        MySqlDataReader dataReader = null;
        MySqlConnection con = new MySqlConnection();
        string hashBase64;
        // GET: Signup
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string username, string password, string confirmpassword, string secretkey, string confirmsecretkey, string phone)
        {
            Account account = new Account();
            if (username != "" && password != "" && confirmpassword != "" && secretkey != "" && confirmsecretkey != "" && phone != "")
            {
                if (username.Length < 4 || password.Length < 6 || secretkey.Length < 4)
                {
                    TempData["error"] = "Bạn cần điền thông tin đúng quy định";
                    return View();
                }
                else
                {
                    if(ValidateInputNumberAndLetter(username) && 
                        ValidateInputNumberAndLetter(password) && 
                        ValidateInputNumberAndLetter(confirmpassword) &&
                        ValidateInputNumber(secretkey) &&
                        ValidateInputNumber(confirmsecretkey) && 
                        ValidateInputNumber(phone))
                    {
                        //Check database
                        try
                        {
                            con.ConnectionString = connectionString;
                            con.Open();
                            string query = "Select * From accounts where login = '" + username + "'";
                            MySqlCommand cmd = new MySqlCommand(query, con);
                            dataReader = cmd.ExecuteReader();
                            //Read the data and store them in the list
                        }
                        catch (MySqlException ex)
                        {
                            ex.ToString();
                        }
                        if (dataReader.HasRows)
                        {
                            //close Data Reader
                            dataReader.Close();
                            //close Connection
                            con.Close();
                            TempData["error"] = "Tài khoản đã tồn tại";
                            return RedirectToAction("Index", "Signup");
                        }
                        else
                        {
                            //close Data Reader
                            dataReader.Close();
                            //close Connection
                            con.Close();
                            if (password == confirmpassword)
                            {
                                if (secretkey == confirmsecretkey)
                                {
                                    using (SHA1 md = SHA1.Create())
                                    {
                                        byte[] raw = Encoding.UTF8.GetBytes(confirmpassword);
                                        hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                                    }
                                    account.Login = username;
                                    account.Password = hashBase64;
                                    account.Phone = phone;
                                    account.SecretKey = confirmsecretkey;
                                    con.Open();
                                    string query = "INSERT INTO accounts(login,password,phone,secretkey) VALUES ('" +
                                        account.Login + "', '" +
                                        account.Password + "', '" +
                                        account.Phone + "', ' " +
                                        account.SecretKey + "')";
                                    MySqlCommand cmd = new MySqlCommand(query, con);
                                    cmd.ExecuteNonQuery();
                                    con.Close();
                                    Session["user"] = account;
                                    return RedirectToAction("Index", "HomeUser");
                                }
                                else
                                {
                                    TempData["error"] = "Secret Key chưa trùng khớp";
                                    return RedirectToAction("Index", "Signup");
                                }
                            }
                            else
                            {
                                TempData["error"] = "Mật khẩu chưa trùng khớp";
                                return RedirectToAction("Index", "Signup");
                            }
                        }
                    }
                    else
                    {
                        TempData["error"] = "Bạn nhập không hợp lệ";
                        return View();
                    }
                }
            }
            else
            {
                TempData["error"] = "Bạn cần điền đầy đủ thông tin";
                return View();
            }
        }
        public static bool ValidateInputNumberAndLetter(string input)
        {
            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] < 48)
                    return false;
                else if (input[i] > 57 && input[i] < 65)
                    return false;
                else if (input[i] > 90 && input[i] < 97)
                    return false;
                else if (input[i] > 122)
                    return false;
            }
            return true;
        }

        public static bool ValidateInputNumber(string input)
        {
            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] < 48)
                    return false;
                else if (input[i] > 57)
                    return false;
            }
            return true;
        }
    }
}