


const getClassFromName = (req, res, next, name) => {

  req.tableName = name.charAt(0).toUpperCase() + name.slice(1) // Card
  
  next()
}

module.exports = getClassFromName