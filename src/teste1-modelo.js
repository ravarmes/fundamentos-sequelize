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
            nome: DataTypes.STRING
        }, { sequelize, modelName: 'cliente', tableName: 'clientes' })
    }
}

// Inicializando o modelo (CREATE TABLE)
Cliente.init(sequelize);

(async () => {
    await sequelize.sync({ force: true }); // Sincronizando automaticamente todos os modelos

    // Instanciando um objeto
    const cliente1 = Cliente.build({ nome: "Alberto" });
    console.log(cliente1 instanceof Cliente); // true
    console.log(cliente1.nome); // "Alberto"

    // Inserindo um objeto no banco de dados (primeira maneira)
    await cliente1.save();
    console.log('Alberto foi salvo no banco de dados!\n\n');

    // Inserindo um objeto no banco de dados (segunda maneira)
    const cliente2 = await Cliente.create({ nome: "Bernardo" });
    const cliente3 = await Cliente.create({ nome: "Carlos" });
    const cliente4 = await Cliente.create({ nome: "Daniel" });
    console.log('Clientes salvos no banco de dados!\n\n');

    // Atualizando um objeto
    cliente1.nome = "Alberto dos Santos";
    await cliente1.save();
    console.log('Cliente Alberto atualizado no banco de dados!\n\n');

    // Deletando um objeto
    await cliente2.destroy();
    console.log('Cliente Bernardo (id:2) removido do banco de dados!\n\n');

    // findAll: listando todos
    const clientes1 = await Cliente.findAll();
    console.log(clientes1.every(cliente => cliente instanceof Cliente)); // true
    console.log("findAll(): \n", JSON.stringify(clientes1, null, 2), "\n\n");

    // findAll: listando todos (especificando atributos para SELECT)
    const clientes2 = await Cliente.findAll({ attributes: ['nome'] });
    console.log("findAll({ attributes: ['nome'] }): \n", JSON.stringify(clientes2, null, 2), "\n\n");

    // findAll: listando todos (WHERE)
    const clientes3 = await Cliente.findAll({ where: { id: 3 } });
    console.log("findAll({ where: {id: 3} }): \n", JSON.stringify(clientes3, null, 2), "\n\n");

    // findByPk: listando por chave primária
    const clientes4 = await Cliente.findByPk(3);
    console.log("findByPk(3): \n", JSON.stringify(clientes4, null, 2), "\n\n");

    // findOne
    const clientes5 = await Cliente.findOne({ where: { id: 3 } });
    console.log("findOne(3): \n", JSON.stringify(clientes5, null, 2), "\n\n");

})();



