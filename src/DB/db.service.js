export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return await model.findOne(filter).select(select).populate(populate)
}



export const findById = async ({ model, id ="", select = "", populate = [] } = {}) => {
    return await model.findById(id).select(select).populate(populate)
}


export const find = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return await model.find(filter).select(select).populate(populate)
}


export const create = async ({ model, data = [{}], option = { validateBeforeSave: true } }) => {
    return await model.create(data, option)
}