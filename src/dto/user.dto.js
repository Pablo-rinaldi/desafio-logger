class UserDTO {
  constructor(firstName, lastName, role, cid, email) {
    this.nombre = firstName;
    this.apellido = lastName;
    this.role = role;
    this.cid = cid;
    this.email = email;
  }
}

module.exports = UserDTO;
