export type VehicleSource = {
  brand: string;
  vehicleType: "car" | "bike";
  origin: "local" | "imported";
  urls: string[];
  selector: string;
};

export const SOURCES: VehicleSource[] = [
  { brand: "Toyota",   vehicleType: "car", origin: "local",    urls: ["https://www.toyota-indus.com/vehicles/", "https://www.toyota-indus.com/vehicle-availability/"], selector: ".vehicle-card, table tr" },
  { brand: "Honda",    vehicleType: "car", origin: "local",    urls: ["https://www.honda.com.pk/", "https://www.honda.com.pk/vehicles/"], selector: ".car-model, table tr" },
  { brand: "Suzuki",   vehicleType: "car", origin: "local",    urls: ["https://www.suzukipakistan.com/", "https://www.suzukipakistan.com/all-product-prices/"], selector: "table tr, .product" },
  { brand: "Kia",      vehicleType: "car", origin: "local",    urls: ["https://kia-luckymotorcorp.com/vehicles/"], selector: ".vehicle, table tr" },
  { brand: "Hyundai",  vehicleType: "car", origin: "local",    urls: ["https://www.hyundai-nishat.com/vehicles/"], selector: ".vehicle, table tr" },
  { brand: "MG",       vehicleType: "car", origin: "local",    urls: ["https://mgmotors.com.pk/"], selector: ".vehicle, table tr" },
  { brand: "Changan",  vehicleType: "car", origin: "local",    urls: ["https://changan.com.pk/"], selector: ".vehicle, table tr" },
  { brand: "Haval",    vehicleType: "car", origin: "local",    urls: ["https://haval.com.pk/"], selector: ".vehicle, table tr" },
  { brand: "BMW",      vehicleType: "car", origin: "imported", urls: ["https://www.bmw.com.pk/"], selector: ".model, table tr" },
  { brand: "Audi",     vehicleType: "car", origin: "imported", urls: ["https://www.audi.com.pk/"], selector: ".model, table tr" },
  { brand: "Mercedes", vehicleType: "car", origin: "imported", urls: ["https://www.mercedes-benz.com.pk/"], selector: ".model, table tr" },
  { brand: "Honda",    vehicleType: "bike", origin: "local",   urls: ["https://www.atlashonda.com.pk/", "https://www.atlashonda.com.pk/products/"], selector: ".bike-model, table tr" },
  { brand: "Yamaha",   vehicleType: "bike", origin: "local",   urls: ["https://www.yamaha-motor.com.pk/"], selector: ".model, table tr" },
  { brand: "Suzuki",   vehicleType: "bike", origin: "local",   urls: ["https://www.suzukipakistan.com/motorcycles/"], selector: ".model, table tr" },
  { brand: "United",   vehicleType: "bike", origin: "local",   urls: ["https://unitedautos.com.pk/"], selector: ".model, table tr" },
  { brand: "Road Prince", vehicleType: "bike", origin: "local", urls: ["https://roadprince.com.pk/"], selector: ".model, table tr" },
  { brand: "Super Power", vehicleType: "bike", origin: "local", urls: ["https://superpower.com.pk/"], selector: ".model, table tr" },
  { brand: "Unique",   vehicleType: "bike", origin: "local",   urls: ["https://unique-motorcycle.com/"], selector: ".model, table tr" },
  { brand: "Kawasaki", vehicleType: "bike", origin: "imported", urls: ["https://www.kawasaki.com.pk/"], selector: ".model, table tr" },
  { brand: "Benelli",  vehicleType: "bike", origin: "imported", urls: ["https://benelli.com.pk/"], selector: ".model, table tr" },
];

export const BANK_SOURCES = [
  { bank: "HBL CarLoan",       url: "https://www.hbl.com/personal/loans/car-loan" },
  { bank: "Meezan Car Ijarah", url: "https://www.meezanbank.com/car-ijarah/" },
  { bank: "Bank Alfalah",      url: "https://www.bankalfalah.com/car-loan/" },
  { bank: "UBL Drive",         url: "https://www.ubldigital.com/Car-Loan" },
  { bank: "Faysal Bank",       url: "https://www.faysalbank.com/car-loan/" },
  { bank: "Askari Bank",       url: "https://www.askaribank.com/car-loan/" },
];

export const INSURER_SOURCES = [
  { company: "Adamjee Insurance", url: "https://www.adamjee.com.pk/motor-insurance/" },
  { company: "EFU General",       url: "https://www.efuinsurance.com/motor-insurance/" },
  { company: "TPL Insurance",     url: "https://www.tplinsurance.com/motor-insurance/" },
  { company: "Jubilee Insurance", url: "https://www.jubileeinsurance.com/motor-insurance/" },
  { company: "Salaam Takaful",    url: "https://www.salaam.co/" },
  { company: "Askari Insurance",  url: "https://www.askariinsurance.com/motor-insurance/" },
];
