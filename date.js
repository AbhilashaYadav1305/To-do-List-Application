//Returns Date

exports.getDate = function getDate(){

let today = new Date();

const options ={
  weekday: "long",
  day :"numeric",
  month: "long"
};

return today.toLocaleDateString("en-HI", options);

}

//Returns Day
exports.getDay = function getDay(){

let today = new Date();

const options ={
  weekday: "long"
};

return today.toLocaleDateString("en-HI", options);

}
