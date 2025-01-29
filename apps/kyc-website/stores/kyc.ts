import { defineStore } from 'pinia'
import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required')
})

export const documentsSchema = z.object({
  idDocument: z.any(),
  proofOfAddress: z.any(),
  selfie: z.any()
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type Documents = z.infer<typeof documentsSchema>

export const useKycStore = defineStore('kyc', {
  state: () => ({
    currentStep: 1,
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      phone: '',
      email: ''
    } as PersonalInfo,
    documents: {
      idDocument: null,
      proofOfAddress: null,
      selfie: null
    } as Documents,
    isSubmitting: false
  }),
  
  actions: {
    setPersonalInfo(info: PersonalInfo) {
      this.personalInfo = info
    },
    
    setDocuments(docs: Documents) {
      this.documents = docs
    },
    
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    
    async submitKyc() {
      this.isSubmitting = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        return true
      } catch (error) {
        return false
      } finally {
        this.isSubmitting = false
      }
    }
  }
})