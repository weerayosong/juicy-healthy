import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin',
        email: 'admin@juicyhealthy.com',
        password: bcrypt.hashSync('0000', 10),
        isAdmin: true,
    },
    {
        name: 'Yosong Araraki',
        email: 'yos1@example.com',
        password: bcrypt.hashSync('1111', 10),
    },
    {
        name: 'Yoshimura Beniyakumo',
        email: 'yos2@example.com',
        password: bcrypt.hashSync('1111', 10),
    },
]

export default users
