import bcrypt from 'bcryptjs'

const users =[
    {
        name:'Admin User',
        email:'admin@example.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:true,
    },
    {
        name:'Kirti Dutta',
        email:'kirti@example.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
    {
        name:'Khushi Saxena',
        email:'khushi@example.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },

]

export default users