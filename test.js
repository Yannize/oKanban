require('dotenv').config();

const { List } = require('./app/models');


function run() {
    List.findAll({
        include: {all: true, nested: true}
    })
        .then( (lists) => {
            for (const list of lists) {
                console.log(list.name);
                for (const card of list.cards) {
                    console.log(` - ${card.text}`);
                    for (const label of card.labels) {
                        console.log(`  -- label: ${label.name}`);
                    }
                }
            }
        })
        .catch( console.error );
} 

// run();

async function runAsync () {
    try {
        const lists = await List.findAll({include: {all: true, nested: true}});
        for (const list of lists) {
            console.log(list.name);
            for (const card of list.cards) {
                console.log(` - ${card.text}`);
                for (const label of card.labels) {
                    console.log(`  -- label: ${label.name}`);
                }
            }
        }
    } catch (error) {
        console.trace(error);
    }
}

runAsync();