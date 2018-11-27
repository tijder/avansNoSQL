module.exports = {
    get(req, res, next){
        res.status(200).json([])
        return
        var name = req.query.name
        if (!name) {
          name = ''
        }
        Species.find({name: {'$regex': name, '$options': 'i'}})
        .then((species) => {
          if(!species){
            res.status(200).json([])
            return
          }
          res.status(200).json(species)
        }).catch(next)
    },

    create(req, res, next){
    },

    update(req, res, next){
    },

    destroy(req, res, next){
    },
}
