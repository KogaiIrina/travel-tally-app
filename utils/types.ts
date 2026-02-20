export interface CountryType {
  id: number;
  country: string;
  flag: string;
  currency: string;
}

export interface HomeCountryType {
  id: number;
  home_country_id: number;
}
export interface CurrentCountryType {
  id: number;
  current_country: number;
}

export interface ExpensesType {
  id: number;
  amount: number;
  amount_in_home_currency: number;
  home_currency: string;
  selected_currency: string;
  country_id: number;
  expense_types: string;
  date: Date;
  trip_id?: number;
}

export interface TripType {
  id: number;
  name: string;
  country_id: number;
  base_currency: string;
  target_currency: string;
  start_date?: Date;
  end_date?: Date;
  is_active: boolean;
}

export interface TotalSum {
  total: number;
}
