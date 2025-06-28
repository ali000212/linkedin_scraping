import { createClient } from '@supabase/supabase-js';
import type { Employee, Company } from '@/types';

const supabaseUrl = 'https://lcvaxhorthtootarlsnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbXV6a2NucXlpbmNkaGVxdWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjE5NjksImV4cCI6MjA2NTU5Nzk2OX0.-OiPPGDa7q8Hi7cqTPL2Fz6owy5cg-9qsVQSUfulXMo';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface for cached employee data
export interface CachedEmployeeData {
  id: string;
  company_id: string;
  company_name: string;
  query: string;
  regions: string[];
  employees: Employee[];
  cached_at: string;
}

// Function to save employee data to Supabase
export const saveEmployeeData = async (
  companyId: string,
  companyName: string,
  query: string,
  regions: string[],
  employees: Employee[]
): Promise<void> => {
  try {
    // Check if we already have this query cached
    const { data: existingData } = await supabase
      .from('employee_cache')
      .select('id')
      .eq('company_id', companyId)
      .eq('query', query)
      .eq('regions', regions)
      .single();

    const currentTime = new Date().toISOString();

    if (existingData) {
      // Update existing cache
      await supabase
        .from('employee_cache')
        .update({
          employees,
          cached_at: currentTime
        })
        .eq('id', existingData.id);
    } else {
      // Create new cache entry
      await supabase.from('employee_cache').insert({
        company_id: companyId,
        company_name: companyName,
        query,
        regions,
        employees,
        cached_at: currentTime
      });
    }
    
    console.log('Employee data cached successfully');
  } catch (error) {
    console.error('Error caching employee data:', error);
  }
};

// Function to get cached employee data from Supabase
export const getCachedEmployeeData = async (
  companyId: string,
  query: string,
  regions: string[]
): Promise<Employee[] | null> => {
  try {
    // Get cached data
    const { data } = await supabase
      .from('employee_cache')
      .select('*')
      .eq('company_id', companyId)
      .eq('query', query)
      .eq('regions', regions)
      .single();

    if (data) {
      console.log('Retrieved cached employee data from', data.cached_at);
      // Check if cache is older than 24 hours
      const cachedTime = new Date(data.cached_at).getTime();
      const currentTime = new Date().getTime();
      const cacheAgeHours = (currentTime - cachedTime) / (1000 * 60 * 60);
      
      if (cacheAgeHours > 24) {
        console.log('Cache is older than 24 hours, should refresh');
        return null;
      }
      
      return data.employees;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving cached employee data:', error);
    return null;
  }
};

// Function to save company data to Supabase
export const saveCompanyData = async (
  company: any // Apollo company response
): Promise<void> => {
  try {
    const { data: existingData } = await supabase
      .from('companies')
      .select('id')
      .eq('apollo_id', company.id)
      .single();
    
    const currentTime = new Date().toISOString();
    
    if (existingData) {
      // Update existing company
      await supabase
        .from('companies')
        .update({
          data: company,
          updated_at: currentTime
        })
        .eq('id', existingData.id);
    } else {
      // Create new company entry
      await supabase.from('companies').insert({
        apollo_id: company.id,
        name: company.name,
        data: company,
        created_at: currentTime,
        updated_at: currentTime
      });
    }
    
    console.log('Company data saved successfully');
  } catch (error) {
    console.error('Error saving company data:', error);
  }
};

// Function to get cached company data
export const getCachedCompanyData = async (
  companyName: string
): Promise<any | null> => {
  try {
    const { data } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', `%${companyName}%`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (data) {
      console.log('Retrieved cached company data');
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving cached company data:', error);
    return null;
  }
}; 