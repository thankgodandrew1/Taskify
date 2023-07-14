exports.getHome = (req, res) => {
  const loginLink = 'https://taskify-d56k.onrender.com/login';
  const logoutLink = 'https://taskify-d56k.onrender.com/logout';

  if (req.isAuthenticated()) {
    // Sends if the user is logged in
    res.send(
      `<html>
        <head>
          <style>
            body {
              background-color: #f2f2f2;
            }
            h1 {
              text-align: center;
              font-family: cursive;
            }
          </style>
        </head>
        <body>
          <h1>Hello, ${req.user.displayName}! Welcome to the Taskify Web API project!</h1>
          <a href="${logoutLink}" style="position: absolute; font-family: cursive; top: 10px; right: 10px; color: white; background-color: red; padding: 10px; text-decoration: none; border-radius: 8px; font-weight: bold;">Logout</a>
        </body>
      </html>`
    );
  } else {
    // Srnds to the browser if not logged in
    res.send(
      `<html>
        <head>
          <style>
            body {
              background-color: #f2f2f2;
            }
            h1 {
              text-align: center;
              font-family: cursive;
            }
          </style>
        </head>
        <body>
          <h1>Hello, welcome to the Taskify Web API project!</h1>
          <a href="${loginLink}" style="position: absolute; font-family: cursive; top: 10px; right: 10px; color: white; background-color: blue; padding: 10px; text-decoration: none; border-radius: 8px; background-image: linear-gradient(to right, lightblue, blue, #008CBA); font-weight: bold;">Login</a>
        </body>
      </html>`
    );
  }
};
