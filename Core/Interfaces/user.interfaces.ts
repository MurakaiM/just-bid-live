export interface UserInterface{
  email: string,
  phone : string,
  password: string,  
  firstName: string,
  lastName: string,
  birthday : Date,
  imgUrl : string
}

export interface UserPassword{
  password : string,
  salt : string
}

export interface UserPublic{
  email : string,
  uid : string,
  provider : string,
  firstName : string,
  lastName : string,
  img? : string
}

export interface UserLogin{
  email : string,
  password : string
}

export interface UserMessages{
  reason: string,
  success :  boolean
}