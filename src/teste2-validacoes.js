const { Sequelize, Model, DataTypes } = require("sequelize");

// Abrindo conexão
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Definindo as classes de modelo
class Cliente extends Model {
    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "O nome do cliente deve ser preenchido!" },
                    len: { args: [2, 50], msg: "O nome do cliente deve ter entre 2 e 50 letras!" }
                }
            }
        }, { sequelize, modelName: 'cliente', tableName: 'clientes' })
    }
}

// Inicializando o modelo (CREATE TABLE)
Cliente.init(sequelize);

(async () => {
    await sequelize.sync({ force: true }); // Sincronizando automaticamente todos os modelos

    // Inserindo dois clientes
    const cliente1 = await Cliente.create({ nome: "Alberto" }); // Cliente inserido com sucesso!
    const cliente2 = await Cliente.create({ nome: "A" }); // SequelizeValidationError :: Problema na inserção!
    
})();



