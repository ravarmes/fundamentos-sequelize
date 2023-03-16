const { Sequelize, Model, DataTypes } = require("sequelize");

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

class Telefone extends Model {
    static init(sequelize) {
        super.init({
            numero: DataTypes.STRING
        }, { sequelize, modelName: 'telefone', tableName: 'telefones' })
    }
}

class Venda extends Model {
    static init(sequelize) {
        super.init({
            valor: DataTypes.FLOAT
        }, { sequelize, modelName: 'venda', tableName: 'vendas' })
    }
}

// Inicializando os modelos
Cliente.init(sequelize);
Telefone.init(sequelize);
Venda.init(sequelize);

// Configurando as associações entre os modelos
Cliente.hasMany(Telefone, {as: 'telefones'});
Venda.belongsTo(Cliente);

(async () => {
    await sequelize.sync({ force: true }); // para sincronizar automaticamente todos os modelos

    // Inserindo um cliente e dois telefones para, depois, vincular os telefones ao cliente
    const cliente1 = await Cliente.create({ nome: "Alberto" });
    const telefone1 = await Telefone.create({ numero: "(11) 1111-1111" });
    const telefone2 = await Telefone.create({ numero: "(22) 2222-2222" });
    await cliente1.setTelefones([telefone1, telefone2]);
    
    // Inserindo um telefone já com informação do cliente
    const telefone3 = await Telefone.create({ numero: "(33) 3333-3333", clienteId: cliente1.id });

    console.log('Cliente e telefones salvos no banco de dados!\n\n');

    // Inserindo duas vendas para, depois, vincular as vendas ao cliente
    const venda1 = await Venda.create({ valor: 100 });
    const venda2 = await Venda.create({ valor: 200 });
    await venda1.setCliente(cliente1);
    await venda2.setCliente(cliente1);
    
    // Inserindo uma venda já com informação do cliente
    const venda3 = await Venda.create({ valor: 300, clienteId: cliente1.id });

    console.log('Vendas salvas no banco de dados!\n\n');

    // Listando todos os clientes, incluindos suas informações de telefones
    const clientes1 = await Cliente.findAll({include: 'telefones'});
    console.log("\nCliente.findAll({include: 'telefones'}): \n", JSON.stringify(clientes1, null, 2));

    await cliente1.destroy();

})();



