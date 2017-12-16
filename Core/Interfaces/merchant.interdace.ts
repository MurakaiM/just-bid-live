export interface MerchantIncome{
    individual : MerchantIndividual,
    business : MerchantBussines,
    funding : MerchantFunding ,
    tosAccepted : boolean,
    masterMerchantAccountId : string,
    id : string
}

interface MerchantBussines{
    legalName: string,
    dbaName?: string,
    taxId: string,
    address : MerchantAddress
}

interface MerchantIndividual{
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,    
    ssn? : string
    address: MerchantAddress
}

interface MerchantAddress{
    streetAddress: string,
    locality: string,
    region: string,
    postalCode: string
}

interface MerchantFunding{
    descriptor: string,
    destination: string,
    email: string,
    mobilePhone: string,
    accountNumber: string,
    routingNumber: string
}