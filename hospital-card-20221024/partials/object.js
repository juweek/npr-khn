module.exports = {
  policies: {
    "Which hospitals will deny nonemergency medical care to patients with past-due bills?": "DENIED",
    "Which hospitals post a Finacial Assistance Policy online, outlining which patients qualify for help with their bills and how they can get aid?": "FAP",
    "Which hospitals post their collection policies online, explaining what tactics they use to collect bills and what can happen to patients who don't pay?": "COLLECTIONS",
    "Which hospitals — or collection agencies working with them — will report patients who don't pay their bills to credit reporting agencies?": "REPORTED",
    "Which hospitals will sell patients' debts to third-party buyers, who can then pursue patients to collect?": "DEBT",
    "Which hospitals — or collection agencies working with them — will sue patients or take other legal actions to collect bills, such as garnishing wages or placing liens on patients' property?": "SUED",
    "Info on financial assistance available with 'financial assistance' search?" : "FINASSIST",
    "Medicaid expansion?": "MEDICAID",
    "Places liens or garnishes wages?": "LIENS",
    "Qualifying income for discounted care?": "DISCOUNTED",
    "Scorecard notes": "SCORECARD",
    "CITY": "CITY",
    "fips": "fips",
    "HOSPITAL_TYPE": "HOSPITAL_TYPE",
    "STATE": "state",
    "SYSTEM": "SYSTEM",
    "NAME": "NAME",
  },

  //come up with an array of arrays that hold colors that you want to use for the key, one group of colors for each policy
  colors: {
    "DEBT": ['#BF4747', '#5b4a8f', '#C6B6E9'],
    "FAP": ['#88864E', '#BF4747', '#88864E'],
    "COLLECTIONS": ['#9CA566', '#BF4747', '#EE9E4D'],
    "REPORTED": ['#BF4747', '#7D8A77', '#CCAC58'],
    "SUED": ['#BF4747', '#052962', '#94A0B3'],
    "DENIED": ['#b70303', '#357378', '#cfa1a1'],
  },
  listOfArrays: [["state"], 
    ["HOSPITAL_TYPE"],
    ["DENIED"],
    ["REPORTED"],
    ["SUED"],
    ["DEBT"], 
    ["COLLECTIONS"], 
    ["FAP"]],
  radarChart: {
    "DEBT": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "FAP": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "COLLECTIONS": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "REPORTED": "mo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    "SUED": "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem",
    "DENIED": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos.",
    "DISCOUNTED": "lorem ipsum"
  },
  
  states: {
    "All states": "All",
    Arizona: "Ariz.",
  Alabama: "Ala.",
  Alaska: "Alas.",
  Arkansas: "Ark.",
  California: "Calif.",
  Colorado: "Colo.",
  Connecticut: "Conn.",
  "District of Columbia": "D.C.",
  Delaware: "Del.",
  Florida: "Fla.",
  Georgia: "Ga.",
  Hawaii: "Hawaii",
  Idaho: "Idaho",
  Illinois: "Ill.",
  Indiana: "Ind.",
  Iowa: "Iowa",
  Kansas: "Kan.",
  Kentucky: "Ky.",
  Louisiana: "La.",
  Maine: "Maine",
  Maryland: "Md.",
  Massachusetts: "Mass.",
  Michigan: "Mich.",
  Minnesota: "Minn.",
  Mississippi: "Miss.",
  Missouri: "Mo.",
  Montana: "Mont.",
  Nebraska: "Neb.",
  Nevada: "Nev.",
  "New hampshire": "N.H.",
  "New jersey": "N.J.",
  "New mexico": "N.M.",
  "New york": "N.Y.",
  "North carolina": "N.C.",
  "North dakota": "N.D.",
  Ohio: "Ohio",
  Oklahoma: "Okla.",
  Oregon: "Ore.",
  Pennsylvania: "Pa.",
  "Rhode Island": "R.I.",
  "South Carolina": "S.C.",
  "South Dakota": "S.D.",
  Tennessee: "Tenn.",
  Texas: "Texas",
  Utah: "Utah",
  Vermont: "Vt.",
  Virginia: "Va.",
  Washington: "Wash.",
  "West Virginia": "W.Va.",
  Wisconsin: "Wis.",
  Wyoming: "Wyo."
  }
};