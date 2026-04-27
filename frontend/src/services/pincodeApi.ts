export interface PostOffice {
  Name: string
  BranchType: string
  DeliveryStatus: string
  Circle: string
  District: string
  Division: string
  Region: string
  State: string
  Country: string
  Pincode?: string
}

export interface PincodeResult {
  status: 'Success' | 'Error'
  message: string
  postOffices: PostOffice[]
  district: string | null
  state: string | null
}

export async function lookupPincode(pincode: string): Promise<PincodeResult> {
  if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return { status:'Error', message:'Enter a valid 6-digit pincode', 
             postOffices:[], district:null, state:null }
  }
  
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const data = await res.json()
    const result = data[0]
    
    if (result.Status === 'Error' || !result.PostOffice) {
      return { status:'Error', message:'Pincode not found', 
               postOffices:[], district:null, state:null }
    }
    
    return {
      status: 'Success',
      message: result.Message,
      postOffices: result.PostOffice,
      district: result.PostOffice[0]?.District ?? null,
      state: result.PostOffice[0]?.State ?? null,
    }
  } catch {
    return { status:'Error', message:'Network error', 
             postOffices:[], district:null, state:null }
  }
}

export async function lookupBranchName(branchName: string): Promise<PincodeResult> {
  try {
    const encoded = encodeURIComponent(branchName)
    const res = await fetch(`https://api.postalpincode.in/postoffice/${encoded}`)
    const data = await res.json()
    const result = data[0]
    
    if (result.Status === 'Error' || !result.PostOffice) {
      return { status:'Error', message:'Branch not found',
               postOffices:[], district:null, state:null }
    }
    
    return {
      status: 'Success',
      message: result.Message,
      postOffices: result.PostOffice,
      district: result.PostOffice[0]?.District ?? null,
      state: result.PostOffice[0]?.State ?? null,
    }
  } catch {
    return { status:'Error', message:'Network error',
             postOffices:[], district:null, state:null }
  }
}

export const MUMBAI_PINCODE_WARDS: Record<string, string> = {
  '400017': 'Dharavi',
  '400024': 'Dharavi',
  '400070': 'Kurla East',
  '400043': 'Govandi',
  '400088': 'Mankhurd',
  '400050': 'Bandra West',
  '400051': 'Bandra West',
  '400092': 'Borivali',
}
