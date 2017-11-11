export const SPARK_KEY = process.env.SPARK_KEY || '6f7e4bb7dfeb4689d8b0556794258a2d4885e305'

export const DATABASE_URL = process.env.DATABASE_URL || 'postgres://admin:md53c17b0bb7cd76e4f80ad10e45d4acb56@localhost:5432/auction'

export const REDIS_URL = process.env.REDIS_URL ||  'redis://h:p4dd2c2e81c10aeebee3501fc77dadd284a86a6e5979384474503d025f324cf41@ec2-54-208-76-96.compute-1.amazonaws.com:59189'

export const GOOGLE_APP = process.env.GOOGLE_APP || 'mythical-bazaar-175300'

export const DOMAIN = process.env.DOMAIN || 'http://localhost:8080'

export const STRIPE_SECRET = process.env.STRIPE_SECRET || 'sk_test_b3lIafPPmnd0DPdXslzRt7RG'

export const STRIPE_PUBLIC = process.env.STRIPE_PUBLIC || 'pk_test_rkROYQBkFdCz9tQoBr2AmrUu'

export const STRIPE_WEBHOOKS = require('../Keys/stripe.webhooks.json')

export const STORAGE_CREDITNAILS = require('../Keys/storage.json')

export const PORT = parseInt(process.env.PORT) || 8080

export const HOST_URL = DOMAIN



export const GOOGLE_AUTH_CLIENTID = process.env.GOOGLE_AUTH_CLIENT_ID || '131187575520-s2pql3nps5qi305bsvlog35dh3d8alum.apps.googleusercontent.com'

export const GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET || 'NFYqAmZpd36t-rbLGX0cUZWA'


export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '352673801850452'

export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || 'c3ba385eaa269aa0ddb64693ff958a18'



export const GOOGLE_AUTH_CALLBACK = process.env.GOOGLE_AUTH_CALLBACK || '/auth/callback/google'

export const FACEBOOK_AUTH_CALLBACK = process.env.FACEBOOK_AUTH_CALLBACK || '/auth/callback/facebook'