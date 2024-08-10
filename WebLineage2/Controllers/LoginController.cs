using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using WebLineage2.Models;

namespace WebLineage2.Controllers
{
    public class LoginController : Controller
    {
        string connectionString = "server=103.153.68.254; port=3306; uid=root; pwd=;database=l2jmobiusclassic";
        MySqlDataReader dataReader = null;
        MySqlConnection con = new MySqlConnection();
        string hashBase64;
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Index(string username, string password)
        {
            Account account = new Account();
            if (username != "" && password != "")
            {
                if (ValidateInputNumberAndLetter(username) && ValidateInputNumberAndLetter(password))
                {
                    //Check database
                    try
                    {
                        con.ConnectionString = connectionString;
                        con.Open();
                        using (SHA1 md = SHA1.Create())
                        {
                            byte[] raw = Encoding.UTF8.GetBytes(password);
                            hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                        }
                        string query = "Select * From accounts where login = '" + username + "' AND password = '" + hashBase64 + "'";
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
                        while (dataReader.Read())
                        {
                            account.Login = dataReader["login"].ToString();
                            account.Password = dataReader["password"].ToString();
                            account.Phone = dataReader["phone"].ToString();
                            account.SecretKey = dataReader["secretkey"].ToString();
                        }
                        //close Data Reader
                        dataReader.Close();
                        //close Connection
                        con.Close();
                        Session["user"] = account;
                        return RedirectToAction("Index", "HomeUser");
                    }
                    else
                    {
                        TempData["error"] = "Tài khoản đăng nhập không đúng";
                        return View();
                    }
                }
                else
                {
                    TempData["error"] = "Bạn nhập không hợp lệ";
                    return View();
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
    }
}