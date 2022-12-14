import Knex from "knex";

export const knex = Knex({
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_ROOT_USERNAME,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: Number(process.env.MYSQL_PORT),
        //MYSQL BIT 타입을 JS의 BOOLEAN 타입으로 변환
        typeCast: function castField( field: any, useDefaultTypeCasting: any ) {
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                const bytes = field.buffer();
                return( bytes[ 0 ] === 1 );
            }

            return( useDefaultTypeCasting() );

        }
    }
});