using System;
using System.Web;
using CLAIMS.BLL;
using System.Data;
using System.Configuration;
using System.Web.SessionState;
using System.Drawing;

public class Img : IHttpHandler, IRequiresSessionState
{
 
 public void ProcessRequest (HttpContext context) 
 {
  context.Response.ContentType = "image/Jpeg";
  
  string s_random = "";
  System.IO.MemoryStream ms = new System.IO.MemoryStream();
  s_random = RndNum(4);
  context.Session["random"] = s_random;
  s_random = s_random.Substring(0, 1) + " " + s_random.Substring(1, 1) + " " + s_random.Substring(2, 1) + " " + s_random.Substring(3, 1);
  
  CreateImage(s_random, ref ms);
  context.Response.ClearContent();
  context.Response.BinaryWrite(ms.ToArray());

  context.Response.Flush();
  context.Response.End();
 }

 private void CreateImage(string checkCode,ref System.IO.MemoryStream ms)
 {
  int iwidth = (int)(checkCode.Length * 18);
  System.Drawing.Bitmap image = new System.Drawing.Bitmap(iwidth, 45);
  Graphics g = Graphics.FromImage(image);
  g.Clear(Color.White);
  //定义颜色
  Color[] c = { Color.Black, Color.Red, Color.DarkBlue, Color.Green, Color.Orange, Color.Brown, Color.DarkCyan, Color.Purple };
  //定义字体   
  //string[] font = {"Verdana","Microsoft Sans Serif","Comic Sans MS","Arial","宋体"};
  Random rand = new Random();
  //随机输出噪点
  for (int i = 0; i < 50; i++)
  {
   int x = rand.Next(image.Width);
   int y = rand.Next(image.Height);
   g.DrawRectangle(new Pen(Color.LightGray, 0), x, y, 1, 1);
  }

  //输出不同字体和颜色的验证码字符

  for (int i = 0; i < checkCode.Length; i++)
  {
   int cindex = rand.Next(7);
   int findex = rand.Next(5);
   Font font = new System.Drawing.Font("Arial", 24, (System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic));
   Brush b = new System.Drawing.SolidBrush(c[cindex]);
   int ii = 4;
   if ((i + 1) % 2 == 0)
   {
    ii = 2;
   }
   g.DrawString(checkCode.Substring(i, 1), font, b, 3 + (i * 12), ii);
  }
  //画一个边框

  g.DrawRectangle(new Pen(Color.Black, 0), 0, 0, image.Width - 1, image.Height - 1);

  //输出到浏览器
  image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
  
  g.Dispose();
  image.Dispose();
 }

 public static String RndNum(int VcodeNum)
 {
  String Vchar = "0,1,2,3,4,5,6,7,8,9";
  String[] VcArray = Vchar.Split(',');
  String VNum = "";
  Random random = new Random();
  for (int i = 1; i <= VcodeNum; i++)
  {
   int iNum = 0;
   while ((iNum = Convert.ToInt32(VcArray.Length * random.NextDouble())) == VcArray.Length)
   {
    iNum = Convert.ToInt32(VcArray.Length * random.NextDouble());
   }
   VNum += VcArray[iNum];
  }
  return VNum;
 }
 
 public bool IsReusable {
  get {
   return false;
  }
 }

}