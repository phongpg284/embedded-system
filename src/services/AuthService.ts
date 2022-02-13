import { JWT_KEY } from "../config"
import { Model } from "mongoose"
import { verify } from "argon2"
import jwt from "jsonwebtoken"
import { IAccount } from "../models/AccountModel"
import AuthModel, { IAuth } from "../models/AuthModel"
import AccountService from "./AccountService"
import DoctorService from "./DoctorService"
import PatientService from "./PatientService"

export interface IRegisterData {
    fullName: string
    email: string
    password: string
    role: string
    pk?: string
}

class AuthService {
    private readonly model: Model<IAuth>
    private readonly accountService: AccountService
    private readonly doctorService: DoctorService
    private readonly patientService: PatientService

    constructor() {
        this.model = AuthModel
        this.accountService = new AccountService()
        this.doctorService = new DoctorService()
        this.patientService = new PatientService()
    }

    async generateToken(data: IAccount) {
        const jwtKey = JWT_KEY

        try {
            const token = jwt.sign(
                {
                    id: data._id,
                    pk: data.pk,
                    email: data.email,
                    role: data.role,
                },
                jwtKey
            )
            return token
        } catch (error) {
            return error
        }
    }

    async login(email: string, password: string) {
        const res = await this.accountService.getByEmail(email)
        console.log(res)
        if (res.error) {
            return res
        }
        if (!res.data) {
            return res
        }
        const isMatchingPassword = await verify(res.data.password, password)
        if (!isMatchingPassword) {
            return {
                message: "Wrong Password",
            }
        }
        const token = await this.generateToken(res.data)
        return {
            statusCode: 200,
            data: {
                _id: res.data._id,
                pk: res.data.pk,
                email: res.data.email,
                role: res.data.role,
                token,
            },
        }
    }

    async register(data: IRegisterData) {
        let doctor, patient
        if (!(await this.accountService.getByEmail(data.email)).error)
            return {
                error: true,
                statusCode: 400,
                message: "This email already exists",
            }
        if (data.role === "doctor") {
            doctor = await this.doctorService.insert(data)
            if (doctor.error || !doctor.data) {
                return {
                    statusCode: 500,
                    message: "Failed to create account",
                }
            }
            await this.accountService.insert({
                ...data,
                pk: doctor.data?._id,
            })
            return { error: false, statusCode: 201 }
        } else if (data.role === "patient") {
            patient = await this.patientService.insert(data)
            if (patient.error || !patient.data) {
                return {
                    statusCode: 500,
                    message: "Failed to create account",
                }
            }
            await this.accountService.insert({
                ...data,
                pk: patient.data?._id,
            })
            return { error: false, statusCode: 201 }
        } else
            return {
                error: true,
                statusCode: 400,
                message: "Invaid role",
            }
    }
}

export default AuthService
