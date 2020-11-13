db.createUser(
  {
    user: "usernameGoHere",
    pwd: "pwdGoHere",
    roles: [
      {
        role: "readWrite",
        db: "db-go-here"
      }
    ]
  }
)