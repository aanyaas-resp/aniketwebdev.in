export type IndiaRegion = {
  slug: string;
  name: string;
  type: "state" | "union territory";
  cities: string[];
};

export const INDIA_REGIONS: IndiaRegion[] = [
  { slug: "andhra-pradesh", name: "Andhra Pradesh", type: "state", cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Kadapa", "Anantapur"] },
  { slug: "arunachal-pradesh", name: "Arunachal Pradesh", type: "state", cities: ["Itanagar", "Naharlagun", "Tawang", "Ziro", "Pasighat", "Bomdila"] },
  { slug: "assam", name: "Assam", type: "state", cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon"] },
  { slug: "bihar", name: "Bihar", type: "state", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Bihar Sharif"] },
  { slug: "chhattisgarh", name: "Chhattisgarh", type: "state", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Raigarh"] },
  { slug: "goa", name: "Goa", type: "state", cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"] },
  { slug: "gujarat", name: "Gujarat", type: "state", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Bharuch", "Gandhidham", "Porbandar"] },
  { slug: "haryana", name: "Haryana", type: "state", cities: ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani"] },
  { slug: "himachal-pradesh", name: "Himachal Pradesh", type: "state", cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Hamirpur", "Una", "Bilaspur", "Kangra"] },
  { slug: "jharkhand", name: "Jharkhand", type: "state", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar", "Giridih", "Phusro"] },
  { slug: "karnataka", name: "Karnataka", type: "state", cities: ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru"] },
  { slug: "kerala", name: "Kerala", type: "state", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kannur", "Kottayam", "Malappuram"] },
  { slug: "madhya-pradesh", name: "Madhya Pradesh", type: "state", cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Khandwa"] },
  { slug: "maharashtra", name: "Maharashtra", type: "state", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Navi Mumbai", "Chhatrapati Sambhajinagar", "Solapur", "Kolhapur", "Amravati", "Sangli", "Akola", "Latur", "Nanded", "Jalgaon", "Ahilyanagar", "Dhule"] },
  { slug: "manipur", name: "Manipur", type: "state", cities: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"] },
  { slug: "meghalaya", name: "Meghalaya", type: "state", cities: ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara"] },
  { slug: "mizoram", name: "Mizoram", type: "state", cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"] },
  { slug: "nagaland", name: "Nagaland", type: "state", cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"] },
  { slug: "odisha", name: "Odisha", type: "state", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"] },
  { slug: "punjab", name: "Punjab", type: "state", cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Batala", "Moga", "Firozpur"] },
  { slug: "rajasthan", name: "Rajasthan", type: "state", cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar"] },
  { slug: "sikkim", name: "Sikkim", type: "state", cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo"] },
  { slug: "tamil-nadu", name: "Tamil Nadu", type: "state", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi", "Dindigul", "Thanjavur"] },
  { slug: "telangana", name: "Telangana", type: "state", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad"] },
  { slug: "tripura", name: "Tripura", type: "state", cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Ambassa"] },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", type: "state", cities: ["Lucknow", "Kanpur", "Ghaziabad", "Noida", "Agra", "Varanasi", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Firozabad", "Jhansi", "Mathura", "Ayodhya"] },
  { slug: "uttarakhand", name: "Uttarakhand", type: "state", cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital", "Mussoorie", "Almora"] },
  { slug: "west-bengal", name: "West Bengal", type: "state", cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Haldia"] },
  { slug: "andaman-and-nicobar-islands", name: "Andaman and Nicobar Islands", type: "union territory", cities: ["Port Blair", "Diglipur", "Mayabunder", "Car Nicobar", "Rangat"] },
  { slug: "chandigarh", name: "Chandigarh", type: "union territory", cities: ["Chandigarh"] },
  { slug: "dadra-and-nagar-haveli-and-daman-and-diu", name: "Dadra and Nagar Haveli and Daman and Diu", type: "union territory", cities: ["Silvassa", "Daman", "Diu", "Amli", "Naroli"] },
  { slug: "delhi", name: "Delhi", type: "union territory", cities: ["New Delhi", "Dwarka", "Rohini", "Narela", "Shahdara", "Najafgarh"] },
  { slug: "jammu-and-kashmir", name: "Jammu and Kashmir", type: "union territory", cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur", "Pulwama", "Rajouri", "Poonch"] },
  { slug: "ladakh", name: "Ladakh", type: "union territory", cities: ["Leh", "Kargil", "Diskit", "Nubra", "Padum"] },
  { slug: "lakshadweep", name: "Lakshadweep", type: "union territory", cities: ["Kavaratti", "Agatti", "Minicoy", "Andrott", "Amini"] },
  { slug: "puducherry", name: "Puducherry", type: "union territory", cities: ["Puducherry", "Karaikal", "Mahe", "Yanam", "Ozhukarai"] },
];

export function getIndiaRegion(slug: string) {
  return INDIA_REGIONS.find((region) => region.slug === slug) ?? null;
}
