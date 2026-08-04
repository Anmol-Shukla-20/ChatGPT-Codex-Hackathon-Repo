export type CitizenProfile = {
  id?: string;
  user_id?: string;
  name: string;
  age: number | string;
  gender: string;
  state: string;
  district: string;
  occupation: string;
  annual_income: number | string;
  category: string;
  disability: string;
  education: string;
  family_size: number | string;
  created_at?: string;
  updated_at?: string;
};

export type SchemeRuleField =
  | "age"
  | "gender"
  | "state"
  | "district"
  | "occupation"
  | "annual_income"
  | "category"
  | "disability"
  | "education"
  | "family_size"
  | "document_types";

export type SchemeCatalogItem = {
  id: string;
  title: string;
  category: string;
  level: "Central" | "State";
  state_scope?: string[];
  description: string;
  benefits: string[];
  required_documents: string[];
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxAnnualIncome?: number;
    categories?: string[];
    occupations?: string[];
    disabilityRequired?: boolean;
    educationMin?: string;
    familySizeMin?: number;
    states?: string[];
  };
  tags: string[];
  state?: string;
  scheme_type?: "Central" | "State";
  official_apply_url?: string;
  official_scheme_url?: string;
  last_updated?: string;
  eligibility_rules?: string;
};

export type DocumentRecord = {
  id?: string;
  user_id?: string;
  file_name: string;
  file_url: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  document_type: string;
  uploaded_at?: string;
  extracted_text?: string;
};

export type SchemeRecommendation = {
  id: string;
  title: string;
  eligibility_score: number;
  reason: string;
  required_documents: string[];
  next_steps: string[];
  benefits: string[];
  category: string;
  level: "Central" | "State";
  matching_criteria?: string[];
  missing_documents?: string[];
  official_apply_url?: string;
  official_scheme_url?: string;
  last_updated?: string;
  state?: string;
  scheme_type?: "Central" | "State";

  // Added...
  eligibility_rules?: string;
  tags?: string[];
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    maxAnnualIncome?: number;
    categories?: string[];
    occupations?: string[];
    disabilityRequired?: boolean;
    educationMin?: string;
    familySizeMin?: number;
    states?: string[];
  };
  
};

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
};
