export interface Address {
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  mobile_number?: string;
}

export class AddressBuilder {
  private address: Address = {};

  withFirstName(firstName: string): AddressBuilder {
    this.address.firstname = firstName;
    return this;
  }

  withLastName(lastName: string): AddressBuilder {
    this.address.lastname = lastName;
    return this;
  }

  withCompany(company: string): AddressBuilder {
    this.address.company = company;
    return this;
  }

  withAddress(address1: string, address2?: string): AddressBuilder {
    this.address.address1 = address1;
    if (address2) this.address.address2 = address2;
    return this;
  }

  withCity(city: string): AddressBuilder {
    this.address.city = city;
    return this;
  }

  withState(state: string): AddressBuilder {
    this.address.state = state;
    return this;
  }

  withZipcode(zipcode: string): AddressBuilder {
    this.address.zipcode = zipcode;
    return this;
  }

  withCountry(country: string): AddressBuilder {
    this.address.country = country;
    return this;
  }

  withMobileNumber(mobile: string): AddressBuilder {
    this.address.mobile_number = mobile;
    return this;
  }

  build(): Address {
    return { ...this.address };
  }
}
