module.exports = {
    moongooseToObject: function (mongooses) {
      return mongooses ? mongooses.toObject() : mongooses;
    },
  };