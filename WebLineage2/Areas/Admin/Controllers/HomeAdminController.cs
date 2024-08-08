using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace WebLineage2.Areas.Admin.Controllers
{
    public class HomeAdminController : Controller
    {
        // GET: Admin/HomeAdmin
        public ActionResult Index()
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Login");
            }
            else
            {
                return View();
            }
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(string username, string password)
        {
            //Check db

            //check code
            if(username.ToLower() == "admin" && password == "123456")
            {
                Session["user"] = "admin";
                return RedirectToAction("Index");
            }
            else
            {
                TempData["error"] = "Tài khoản đăng nhập không đúng";
                return View();
            }
        }

        public ActionResult Logout()
        {
            // Xóa session
            Session.Remove("user");
            // Xóa session form Authen
            FormsAuthentication.SignOut();
            // Chuyển về trang đăng nhập
            return RedirectToAction("Login");
        }
    }
}