export class InvalidData extends Error {
  constructor(message = 'A validation error occurred', field) {
    super(message)
    this.name = 'InvalidData'
    this.status = 400
    this.field = field
    this.response = { [field]: message }
  }
}

export class NotFound extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFound'
    this.status = 404
  }
}

export class Forbidden extends Error {
  constructor(message = 'You do not have permission to access this resource') {
    super(message)
    this.name = 'Forbidden'
    this.status = 403
  }
}

export class Unauthorized extends Error {
  constructor(message = 'Unauthorized'){
    super(message)
    this.name = 'Unauthorized'
    this.status = 401
  }
}