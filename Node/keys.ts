export const SPARK_KEY = process.env.SPARK_KEY || '6f7e4bb7dfeb4689d8b0556794258a2d4885e305'

export const DATABASE_URL = process.env.DATABASE_URL || 'postgres://admin:md53c17b0bb7cd76e4f80ad10e45d4acb56@localhost:5432/auction'

export const REDIS_URL = process.env.REDIS_URL ||  'redis://h:p4dd2c2e81c10aeebee3501fc77dadd284a86a6e5979384474503d025f324cf41@ec2-54-208-76-96.compute-1.amazonaws.com:59189'

export const GOOGLE_APP = process.env.GOOGLE_APP || 'mythical-bazaar-175300'

export const DOMAIN = process.env.DOMAIN || 'http://localhost:8080'

export const STORAGE_CREDITNAILS = require('../Keys/storage.json')

export const PORT = process.env.PORT || 8080