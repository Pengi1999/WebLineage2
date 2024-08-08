using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebLineage2.Models;

namespace WebLineage2.Controllers
{
    public class HomeUserController : Controller
    {
        string connectionString = "server=103.153.68.254; port=3306; uid=root; pwd=;database=l2jmobiusclassic";
        MySqlDataReader dataReader = null;
        MySqlConnection con = new MySqlConnection();

        // GET: HomeUser
        public ActionResult Index()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                return View();
            }
        }

        public ActionResult Changepassword()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult Changepassword(string oldpassword, string secretkey, string newpassword, string confirmpassword)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Account account = (Account)Session["user"];
                Account accountDB = new Account();
                //Check database
                try
                {
                    con.ConnectionString = connectionString;
                    con.Open();
                    string query = "Select * From accounts where login = '" + account.Login + "'" ;
                    MySqlCommand cmd = new MySqlCommand(query, con);
                    dataReader = cmd.ExecuteReader();
                    //Read the data and store them in the list
                }
                catch (MySqlException ex)
                {
                    ex.ToString();
                }
                while (dataReader.Read())
                {
                    accountDB.Login = dataReader["login"].ToString();
                    accountDB.Password = dataReader["password"].ToString();
                    accountDB.Phone = dataReader["phone"].ToString();
                    accountDB.SecretKey = dataReader["secretkey"].ToString();
                }
                //close Data Reader
                dataReader.Close();
                //close Connection
                con.Close();
                string hashBase64;
                using (SHA1 md = SHA1.Create())
                {
                    byte[] raw = Encoding.UTF8.GetBytes(oldpassword);
                    hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                }
                //Nếu mật khẩu nhập giống mật khẩu trong database
                if (accountDB.Password == hashBase64)
                {
                    //Nếu secret key nhập giống secret key trong database
                    if (accountDB.SecretKey == secretkey)
                    {
                        //Nếu đã nhập trùng password mới
                        if (newpassword == confirmpassword)
                        {
                            using (SHA1 md = SHA1.Create())
                            {
                                byte[] raw = Encoding.UTF8.GetBytes(confirmpassword);
                                hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                            }
                            con.ConnectionString = connectionString;
                            con.Open();
                            string query = "UPDATE accounts SET password = '" + hashBase64 + "' WHERE login = '" + accountDB.Login + "'";
                            MySqlCommand cmd = new MySqlCommand(query, con);
                            cmd.ExecuteNonQuery();
                            con.Close();
                            account.Password = hashBase64;
                            Session["user"] = account;
                            return RedirectToAction("Index", "HomeUser");
                        }
                        //Nếu nhập không trùng password mới
                        else
                        {
                            TempData["error"] = "Mật khẩu mới của bạn không khớp";
                            return RedirectToAction("Changepassword", "HomeUser");
                        }
                    }
                    //Nếu secret key nhập không đúng
                    else
                    {
                        TempData["error"] = "Secret key của bạn không đúng";
                        return RedirectToAction("Changepassword", "HomeUser");
                    }
                }
                //Nếu mật khẩu nhập không đúng
                else
                {
                    TempData["error"] = "Mật khẩu của bạn không đúng";
                    return RedirectToAction("Changepassword", "HomeUser");
                }
            }
        }

        public ActionResult Changesecretkey()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult Changesecretkey(string password, string oldsecretkey, string newsecretkey, string confirmsecretkey)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Account account = (Account)Session["user"];
                Account accountDB = new Account();
                //Check database
                try
                {
                    con.ConnectionString = connectionString;
                    con.Open();
                    string query = "Select * From accounts where login = '" + account.Login + "'";
                    MySqlCommand cmd = new MySqlCommand(query, con);
                    dataReader = cmd.ExecuteReader();
                    //Read the data and store them in the list
                }
                catch (MySqlException ex)
                {
                    ex.ToString();
                }
                while (dataReader.Read())
                {
                    accountDB.Login = dataReader["login"].ToString();
                    accountDB.Password = dataReader["password"].ToString();
                    accountDB.Phone = dataReader["phone"].ToString();
                    accountDB.SecretKey = dataReader["secretkey"].ToString();
                }
                //close Data Reader
                dataReader.Close();
                //close Connection
                con.Close();
                string hashBase64;
                using (SHA1 md = SHA1.Create())
                {
                    byte[] raw = Encoding.UTF8.GetBytes(password);
                    hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                }
                //Nếu mật khẩu nhập giống mật khẩu trong database
                if (accountDB.Password == hashBase64)
                {
                    //Nếu secret key nhập giống secret key trong database
                    if (accountDB.SecretKey == oldsecretkey)
                    {
                        //Nếu đã nhập trùng secret key mới
                        if (newsecretkey == confirmsecretkey)
                        {
                            con.ConnectionString = connectionString;
                            con.Open();
                            string query = "UPDATE accounts SET secretkey = '" + confirmsecretkey + "' WHERE login = '" + accountDB.Login + "'";
                            MySqlCommand cmd = new MySqlCommand(query, con);
                            cmd.ExecuteNonQuery();
                            con.Close();
                            account.SecretKey = confirmsecretkey;
                            Session["user"] = account;
                            return RedirectToAction("Index", "HomeUser");
                        }
                        //Nếu nhập không trùng secret key mới
                        else
                        {
                            TempData["error"] = "Secret Key mới của bạn không khớp";
                            return RedirectToAction("Changesecretkey", "HomeUser");
                        }
                    }
                    //Nếu secret key nhập không đúng
                    else
                    {
                        TempData["error"] = "Secret key của bạn không đúng";
                        return RedirectToAction("Changesecretkey", "HomeUser");
                    }
                }
                //Nếu mật khẩu nhập không đúng
                else
                {
                    TempData["error"] = "Mật khẩu của bạn không đúng";
                    return RedirectToAction("Changesecretkey", "HomeUser");
                }
            }
        }

        public ActionResult Changephone()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                return View();
            }
        }

        [HttpPost]
        public ActionResult Changephone(string password, string secretkey, string newphone)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                Account account = (Account)Session["user"];
                Account accountDB = new Account();
                //Check database
                try
                {
                    con.ConnectionString = connectionString;
                    con.Open();
                    string query = "Select * From accounts where login = '" + account.Login + "'";
                    MySqlCommand cmd = new MySqlCommand(query, con);
                    dataReader = cmd.ExecuteReader();
                    //Read the data and store them in the list
                }
                catch (MySqlException ex)
                {
                    ex.ToString();
                }
                while (dataReader.Read())
                {
                    accountDB.Login = dataReader["login"].ToString();
                    accountDB.Password = dataReader["password"].ToString();
                    accountDB.Phone = dataReader["phone"].ToString();
                    accountDB.SecretKey = dataReader["secretkey"].ToString();
                }
                //close Data Reader
                dataReader.Close();
                //close Connection
                con.Close();
                string hashBase64;
                using (SHA1 md = SHA1.Create())
                {
                    byte[] raw = Encoding.UTF8.GetBytes(password);
                    hashBase64 = Convert.ToBase64String(md.ComputeHash(raw));
                }
                //Nếu mật khẩu nhập giống mật khẩu trong database
                if (accountDB.Password == hashBase64)
                {
                    //Nếu secret key nhập giống secret key trong database
                    if (accountDB.SecretKey == secretkey)
                    {
                        con.ConnectionString = connectionString;
                        con.Open();
                        string query = "UPDATE accounts SET phone = '" + newphone + "' WHERE login = '" + accountDB.Login + "'";
                        MySqlCommand cmd = new MySqlCommand(query, con);
                        cmd.ExecuteNonQuery();
                        con.Close();
                        account.Phone = newphone;
                        Session["user"] = account;
                        return RedirectToAction("Index", "HomeUser");
                    }
                    //Nếu secret key nhập không đúng
                    else
                    {
                        TempData["error"] = "Secret key của bạn không đúng";
                        return RedirectToAction("Changephone", "HomeUser");
                    }
                }
                //Nếu mật khẩu nhập không đúng
                else
                {
                    TempData["error"] = "Mật khẩu của bạn không đúng";
                    return RedirectToAction("Changephone", "HomeUser");
                }
            }
        }

        public ActionResult Logout()
        {
            // Xóa session
            Session.Remove("user");
            // Xóa session form Authen
            FormsAuthentication.SignOut();
            return RedirectToAction("Index", "Login");
        }
    }
}