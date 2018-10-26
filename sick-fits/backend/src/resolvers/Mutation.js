const mutations = {
  createDog(parent, args, ctx, info) {
    const newDog = { name: args.name };
    global.dogs = global.dogs || [];
    global.dogs.push(newDog);

    return newDog;
  },
};

module.exports = mutations;
