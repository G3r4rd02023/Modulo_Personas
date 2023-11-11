//constante para el paquete mysql
const mysql = require("mysql")

//constante para el paquete Express
const express = require("express");

//variable para los metodos express
var app = express();

//constante para el paquete body-parser
const bp = require("body-parser")

//enviando los datos de json a nodejs api 
app.use(bp.json());

//conectar a la bd mysql 
var mysqlconnection = mysql.createConnection({
    host : 'localhost',
    port: 3306,
    user :'root',
    password:'g3r4rd0',
    database:'uno',
    multipleStatements : true
});

//test de conexion a bd
mysqlconnection.connect((err)=>{
    if(!err){
        console.log('Conexion Exitosa');        
    } else {
        console.log('Error al conectar a la BD');
        console.log(err);
    }
});

//ejecutar el servidor en un puerto especifico
app.listen(3000,()=>console.log('Server running puerto:3000'));

app.get('/',(req,res)=>{
    res.send('Welcome to my Api')
})

//AQUI COMIENZA LA API

//Personas

//Select <-> Get todas las personas con Procedimiento almacenado
app.get('/personas', (req, res) => {    
    mysqlconnection.query('call sel_persona()', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Insert <-> Post con procedimiento almacenado.
app.post('/personas', (req, res) => {
    let per = req.body;
    var sql = "SET @pv_identidad=?; \
               SET @pv_nom_persona=?; \
               SET @pv_ape_persona=?; \
               SET @pc_gen_persona=?; \
               SET @pc_ind_civil=?; \
               SET @pi_eda_persona=?; \
               SET @pc_ind_persona=?; \
               SET @pv_usr_registro=?; \
               CALL IN_PERSONA(@pv_identidad, @pv_nom_persona, @pv_ape_persona, @pc_gen_persona, @pc_ind_civil, @pi_eda_persona, @pc_ind_persona, @pv_usr_registro);";
               mysqlconnection.query(sql, [per.IDENTIDAD, per.NOM_PERSONA, per.APE_PERSONA, per.GEN_PERSONA, per.IND_CIVIL, per.EDA_PERSONA, per.IND_PERSONA, per.USR_REGISTRO], (err, rows, fields) => {
        if (!err) {
            res.send("Ingresado correctamente !!");
        } else {
            console.log(err);
        }
    });
});

//Update <-> Put a personas
app.put('/personas/:COD_PERSONA', (req, res) => {
    const {
        IDENTIDAD,
        NOM_PERSONA,
        APE_PERSONA,
        GEN_PERSONA,
        IND_CIVIL,
        EDA_PERSONA,
        IND_PERSONA,
        USR_REGISTRO
    } = req.body;
    const {
        COD_PERSONA
    } = req.params;
    mysqlconnection.query(
        "CALL AC_PERSONA(?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [COD_PERSONA,IDENTIDAD, NOM_PERSONA, APE_PERSONA, GEN_PERSONA, IND_CIVIL, EDA_PERSONA, IND_PERSONA, USR_REGISTRO],
        (err, rows, fields) => {
            if (!err) {
                //retornar lo actualizado
                res.status(200).json(req.body);
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
});

//Select <-> GET obtener una persona por codigo

app.get('/personas/:COD_PERSONA', (req, res) => {
    const { COD_PERSONA } = req.params;
    mysqlconnection.query('CALL BU_PERSONA(?)', [COD_PERSONA],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar persona

app.delete('/personas/:COD_PERSONA', (req, res) => {
    const { COD_PERSONA } = req.params;

    mysqlconnection.query('CALL EL_PERSONA(?)', [COD_PERSONA], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Persona eliminada exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Telefonos

//Select <-> Get todas los telefonos con Procedimiento almacenado
app.get('/telefonos', (req, res) => {    
    mysqlconnection.query('CALL SEL_TELEFONOS()', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});


//Insert <-> Post con procedimiento almacenado.
app.post('/telefonos', (req, res) => {
    let telefono = req.body;

    var sql = "SET @pi_cod_persona=?; \
               SET @pv_num_telefono=?; \
               SET @pv_tip_telefono=?; \
               CALL IN_TELEFONO(@pi_cod_persona, @pv_num_telefono, @pv_tip_telefono);";

    mysqlconnection.query(
        sql,
        [telefono.COD_PERSONA, telefono.NUM_TELEFONO, telefono.TIP_TELEFONO],
        (err, rows, fields) => {
            if (!err) {
                res.send("Teléfono ingresado correctamente !!");
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    );
});

//Update <-> Put a telefono
app.put('/telefonos/:COD_TELEFONO', (req, res) => {
    const {        
        NUM_TELEFONO,
        TIP_TELEFONO,                
    } = req.body;
    const {
        COD_TELEFONO
    } = req.params;
    mysqlconnection.query(
        "CALL AC_TELEFONO(?, ?, ? )",
        [COD_TELEFONO,NUM_TELEFONO, TIP_TELEFONO],
        (err, rows, fields) => {
            if (!err) {
                //retornar lo actualizado
                res.status(200).json(req.body);
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
});

//Select <-> GET obtener una persona por codigo

app.get('/telefonos/:COD_TELEFONO', (req, res) => {
    const { COD_TELEFONO } = req.params;
    mysqlconnection.query('CALL BU_TELEFONO(?)', [COD_TELEFONO],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar persona

app.delete('/telefonos/:COD_TELEFONO', (req, res) => {
    const { COD_TELEFONO } = req.params;

    mysqlconnection.query('CALL EL_TELEFONO(?)', [COD_TELEFONO], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Telefono eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//usuarios

//Select <-> Get todas los usuarios con Procedimiento almacenado
app.get('/usuarios', (req, res) => {    
    mysqlconnection.query('CALL SEL_USUARIOS()', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Insert <-> Post con procedimiento almacenado.
app.post('/usuarios', (req, res) => {
    let usuario = req.body;

    var sql = "SET @pi_cod_persona=?; \
               SET @pv_usr_nombre=?; \
               SET @pv_usr_contrasena=?; \
               CALL IN_USUARIO(@pi_cod_persona, @pv_usr_nombre, @pv_usr_contrasena);";

    mysqlconnection.query(
        sql,
        [usuario.COD_PERSONA, usuario.USR_NOMBRE, usuario.USR_CONTRASENA],
        (err, rows, fields) => {
            if (!err) {
                res.send("Usuario ingresado correctamente !!");
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    );
});

//Update <-> Put a telefono
app.put('/usuarios/:COD_USUARIO', (req, res) => {
    const {        
        USR_NOMBRE,
        USR_CONTRASENA,                
    } = req.body;
    const {
        COD_USUARIO
    } = req.params;
    mysqlconnection.query(
        "CALL AC_USUARIO(?, ?, ? )",
        [COD_USUARIO,USR_NOMBRE, USR_CONTRASENA],
        (err, rows, fields) => {
            if (!err) {
                //retornar lo actualizado
                res.status(200).json(req.body);
            } else {
                console.log(err);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
});

//Select <-> GET obtener una usuario por codigo

app.get('/usuarios/:COD_USUARIO', (req, res) => {
    const { COD_USUARIO } = req.params;
    mysqlconnection.query('CALL BU_USUARIO(?)', [COD_USUARIO],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar usuario

app.delete('/usuarios/:COD_USUARIO', (req, res) => {
    const { COD_USUARIO } = req.params;

    mysqlconnection.query('CALL EL_USUARIO(?)', [COD_USUARIO], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//empleado
//Select <-> Get todas los empleados con Procedimiento almacenado
app.get('/empleados', (req, res) => {    
    mysqlconnection.query('CALL SEL_EMPLEADOS()', (err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Insert <-> Post con procedimiento almacenado.
app.post('/empleados', (req, res) => {
    const empleado = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pv_nom_empleado = ?;
      SET @pv_ape_empleado = ?;
      SET @pv_rol_empleado = ?;
      SET @pf_fec_contratacion = ?;
      SET @pd_salario = ?;
      CALL IN_EMPLEADO(@pi_cod_persona, @pv_nom_empleado, @pv_ape_empleado, @pv_rol_empleado, @pf_fec_contratacion, @pd_salario);
    `;
  
    mysqlconnection.query(
      sql,
      [
        empleado.COD_PERSONA,
        empleado.NOM_EMPLEADO,
        empleado.APE_EMPLEADO,
        empleado.ROL_EMPLEADO,
        empleado.FEC_CONTRATACION,
        empleado.SALARIO,
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Empleado insertado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

  //Update <-> Put a empleado
  app.put('/empleados/:COD_EMPLEADO', (req, res) => {
    const empleado = req.body;
    const { COD_EMPLEADO } = req.params;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_empleado = ?;
      SET @pv_nom_empleado = ?;
      SET @pv_ape_empleado = ?;
      SET @pv_rol_empleado = ?;
      SET @pf_fec_contratacion = ?;
      SET @pd_salario = ?;
      CALL AC_EMPLEADO(@pi_cod_empleado, @pv_nom_empleado, @pv_ape_empleado, @pv_rol_empleado, @pf_fec_contratacion, @pd_salario);
    `;
  
    mysqlconnection.query(
      sql,
      [
        COD_EMPLEADO,
        empleado.NOM_EMPLEADO,
        empleado.APE_EMPLEADO,
        empleado.ROL_EMPLEADO,
        empleado.FEC_CONTRATACION,
        empleado.SALARIO,
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ message: 'Empleado actualizado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });
  
  //Select <-> GET obtener un empleado por codigo

app.get('/empleados/:COD_EMPLEADO', (req, res) => {
    const { COD_EMPLEADO } = req.params;
    mysqlconnection.query('CALL BU_EMPLEADO(?)', [COD_EMPLEADO],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar usuario

app.delete('/empleados/:COD_EMPLEADO', (req, res) => {
    const { COD_EMPLEADO } = req.params;

    mysqlconnection.query('CALL EL_EMPLEADO(?)', [COD_EMPLEADO], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Empleado eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Correos
//Select <-> Get todas los correos con Procedimiento almacenado
app.get('/correos', (req, res) => {
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = 'CALL SEL_CORREOS()';
  
    mysqlconnection.query(sql, (err, rows, fields) => {
      if (!err) {
        res.status(200).json(rows[0]);
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });

  //Insert <-> Post con procedimiento almacenado.
  app.post('/correos', (req, res) => {
    const correo = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pv_nom_correo = ?;
      SET @pc_tip_correo = ?;
      CALL IN_CORREO(@pi_cod_persona, @pv_nom_correo, @pc_tip_correo);
    `;
  
    mysqlconnection.query(
      sql,
      [correo.COD_PERSONA, correo.NOM_CORREO, correo.TIP_CORREO],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Correo insertado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

 //Update <-> Put a correo
 app.put('/correos/:COD_CORREO', (req, res) => {
    const correo = req.body;
    const { COD_CORREO } = req.params;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_correo = ?;
      SET @pv_nom_correo = ?;
      SET @pc_tip_correo = ?;
      CALL AC_CORREO(@pi_cod_correo, @pv_nom_correo, @pc_tip_correo);
    `;
  
    mysqlconnection.query(
      sql,
      [COD_CORREO, correo.NOM_CORREO, correo.TIP_CORREO],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ message: 'Correo actualizado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });
  
 //Select <-> GET obtener un correo por codigo

 app.get('/correos/:COD_CORREO', (req, res) => {
    const { COD_CORREO } = req.params;
    mysqlconnection.query('CALL BU_CORREO(?)', [COD_CORREO],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar usuario

app.delete('/correos/:COD_CORREO', (req, res) => {
    const { COD_CORREO } = req.params;

    mysqlconnection.query('CALL EL_CORREO(?)', [COD_CORREO], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Correo eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Proveedores
//Select <-> Get todas los proveedores con Procedimiento almacenado
app.get('/proveedores', (req, res) => {
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = 'CALL SEL_PROVEEDORES()';
  
    mysqlconnection.query(sql, (err, rows, fields) => {
      if (!err) {
        res.status(200).json(rows[0]);
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });

//Insert <-> Post con procedimiento almacenado.
  app.post('/proveedores', (req, res) => {
    const proveedor = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pc_tip_proveedor = ?;
      SET @pv_nom_proveedor = ?;
      CALL IN_PROVEEDOR(@pi_cod_persona, @pc_tip_proveedor, @pv_nom_proveedor);
    `;
  
    mysqlconnection.query(
      sql,
      [proveedor.COD_PERSONA, proveedor.TIP_PROVEEDOR, proveedor.NOM_PROVEEDOR],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Proveedor insertado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });


// METODO PUT para actualizar un proveedor
app.put('/proveedores/:COD_PROVEEDOR', (req, res) => {
  const proveedor = req.body;
  const { COD_PROVEEDOR } = req.params;

  // Definir la consulta SQL con los parámetros del procedimiento almacenado
  const sql = `
    SET @p_cod_proveedor = ?;
    SET @p_tip_proveedor = ?;
    SET @p_nom_proveedor = ?;
    CALL AC_PROVEEDOR(@p_cod_proveedor, @p_tip_proveedor, @p_nom_proveedor);
  `;

  mysqlconnection.query(
    sql,
    [COD_PROVEEDOR, proveedor.TIP_PROVEEDOR, proveedor.NOM_PROVEEDOR],
    (err, rows, fields) => {
      if (!err) {
        res.status(200).json({ message: 'Proveedor actualizado correctamente' });
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  );
});

//Select <-> GET obtener un proveedor por codigo

app.get('/proveedores/:COD_PROVEEDOR', (req, res) => {
    const { COD_PROVEEDOR} = req.params;
    mysqlconnection.query('CALL BU_PROVEEDOR(?)', [COD_PROVEEDOR],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar proveedor

app.delete('/proveedores/:COD_PROVEEDOR', (req, res) => {
    const { COD_PROVEEDOR } = req.params;

    mysqlconnection.query('CALL EL_PROVEEDOR(?)', [COD_PROVEEDOR], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Cliente

//Select <-> Get todos los clientes con Procedimiento almacenado
app.get('/clientes', (req, res) => {
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = 'CALL SEL_CLIENTES()';
  
    mysqlconnection.query(sql, (err, rows, fields) => {
      if (!err) {
        res.status(200).json(rows[0]);
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });

  //insert POST CLIENTE
  app.post('/clientes', (req, res) => {
    const cliente = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pc_tip_cliente = ?;
      SET @pv_nom_cliente = ?;
      SET @pv_ape_cliente = ?;
      CALL IN_CLIENTE(@pi_cod_persona, @pc_tip_cliente, @pv_nom_cliente, @pv_ape_cliente);
    `;
  
    mysqlconnection.query(
      sql,
      [cliente.COD_PERSONA, cliente.TIP_CLIENTE, cliente.NOM_CLIENTE, cliente.APE_CLIENTE],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Cliente insertado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

  // PUT para actualizar un cliente
app.put('/clientes/:COD_CLIENTE', (req, res) => {
    const cliente = req.body;
    const { COD_CLIENTE } = req.params;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_cliente = ?;
      SET @pc_tip_cliente = ?;
      SET @pv_nom_cliente = ?;
      SET @pv_ape_cliente = ?;
      CALL AC_CLIENTE(@pi_cod_cliente, @pc_tip_cliente, @pv_nom_cliente, @pv_ape_cliente);
    `;
  
    mysqlconnection.query(
      sql,
      [COD_CLIENTE, cliente.TIP_CLIENTE, cliente.NOM_CLIENTE, cliente.APE_CLIENTE],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ message: 'Cliente actualizado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

  //Select <-> GET obtener un cliente por codigo

app.get('/clientes/:COD_CLIENTE', (req, res) => {
    const { COD_CLIENTE} = req.params;
    mysqlconnection.query('CALL BU_CLIENTE(?)', [COD_CLIENTE],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar CLIENTE

app.delete('/clientes/:COD_CLIENTE', (req, res) => {
    const { COD_CLIENTE } = req.params;

    mysqlconnection.query('CALL EL_CLIENTE(?)', [COD_CLIENTE], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//acreedores
//Select <-> Get todas los proveedores con Procedimiento almacenado
app.get('/acreedores', (req, res) => {
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = 'CALL SEL_ACREEDORES()';
  
    mysqlconnection.query(sql, (err, rows, fields) => {
      if (!err) {
        res.status(200).json(rows[0]);
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });

  //insert POST ACRREDOR
  app.post('/acreedores', (req, res) => {
    const acreedor = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pc_tip_acreedor = ?;
      SET @pv_nom_acreedor = ?;
      SET @pv_ape_acreedor = ?;
      CALL IN_ACREEDOR(@pi_cod_persona, @pc_tip_acreedor, @pv_nom_acreedor, @pv_ape_acreedor);
    `;
  
    mysqlconnection.query(
      sql,
      [acreedor.COD_PERSONA, acreedor.TIP_ACREEDOR, acreedor.NOM_ACREEDOR, acreedor.APE_ACREEDOR],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Acreedor insertado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

  // PUT para actualizar un acreedor
app.put('/acreedores/:COD_ACREEDOR', (req, res) => {
    const acreedor = req.body;
    const { COD_ACREEDOR } = req.params;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_acreedor = ?;
      SET @pc_tip_acreedor = ?;
      SET @pv_nom_acreedor = ?;
      SET @pv_ape_acreedor = ?;
      CALL AC_ACREEDOR(@pi_cod_acreedor, @pc_tip_acreedor, @pv_nom_acreedor, @pv_ape_acreedor);
    `;
  
    mysqlconnection.query(
      sql,
      [COD_ACREEDOR, acreedor.TIP_ACREEDOR, acreedor.NOM_ACREEDOR, acreedor.APE_ACREEDOR],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ message: 'Acreedor actualizado correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });

  //Select <-> GET obtener un cliente por codigo

app.get('/acreedores/:COD_ACREEDOR', (req, res) => {
    const { COD_ACREEDOR} = req.params;
    mysqlconnection.query('CALL BU_ACREEDOR(?)', [COD_ACREEDOR],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar CLIENTE

app.delete('/acreedores/:COD_ACREEDOR', (req, res) => {
    const { COD_ACREEDOR } = req.params;

    mysqlconnection.query('CALL EL_ACREEDOR(?)', [COD_ACREEDOR], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Acreedor eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//DIRECCIONES

//Select <-> Get todas los proveedores con Procedimiento almacenado
app.get('/direcciones', (req, res) => {
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = 'CALL SEL_DIRECCIONES()';
  
    mysqlconnection.query(sql, (err, rows, fields) => {
      if (!err) {
        res.status(200).json(rows[0]);
      } else {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  });

  // POST para insertar una dirección
app.post('/direcciones', (req, res) => {
    const direccion = req.body;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_persona = ?;
      SET @pv_nom_calle = ?;
      SET @pi_num_calle = ?;
      SET @pv_nom_colonia = ?;
      SET @pv_nom_ciudad = ?;
      SET @pv_nom_estado = ?;
      SET @pv_nom_pais = ?;
      SET @pi_id_cod_postal = ?;
      CALL IN_DIRECCION(@pi_cod_persona, @pv_nom_calle, @pi_num_calle, @pv_nom_colonia, @pv_nom_ciudad, @pv_nom_estado, @pv_nom_pais, @pi_id_cod_postal);
    `;
  
    mysqlconnection.query(
      sql,
      [
        direccion.COD_PERSONA,
        direccion.NOM_CALLE,
        direccion.NUM_CALLE,
        direccion.NOM_COLONIA,
        direccion.NOM_CIUDAD,
        direccion.NOM_ESTADO,
        direccion.NOM_PAIS,
        direccion.ID_COD_POSTAL
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(201).json({ message: 'Dirección insertada correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });
  
  // PUT para actualizar una dirección
app.put('/direcciones/:COD_DIRECCION', (req, res) => {
    const direccion = req.body;
    const { COD_DIRECCION } = req.params;
  
    // Definir la consulta SQL con los parámetros del procedimiento almacenado
    const sql = `
      SET @pi_cod_direccion = ?;
      SET @pv_nom_calle = ?;
      SET @pi_num_calle = ?;
      SET @pv_nom_colonia = ?;
      SET @pv_nom_ciudad = ?;
      SET @pv_nom_estado = ?;
      SET @pv_nom_pais = ?;
      SET @pi_id_cod_postal = ?;
      CALL AC_DIRECCION(@pi_cod_direccion, @pv_nom_calle, @pi_num_calle, @pv_nom_colonia, @pv_nom_ciudad, @pv_nom_estado, @pv_nom_pais, @pi_id_cod_postal);
    `;
  
    mysqlconnection.query(
      sql,
      [
        COD_DIRECCION,
        direccion.NOM_CALLE,
        direccion.NUM_CALLE,
        direccion.NOM_COLONIA,
        direccion.NOM_CIUDAD,
        direccion.NOM_ESTADO,
        direccion.NOM_PAIS,
        direccion.ID_COD_POSTAL
      ],
      (err, rows, fields) => {
        if (!err) {
          res.status(200).json({ message: 'Dirección actualizada correctamente' });
        } else {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    );
  });
  
  //Select <-> GET obtener una direccion por codigo

app.get('/direcciones/:COD_DIRECCION', (req, res) => {
    const { COD_DIRECCION} = req.params;
    mysqlconnection.query('CALL BU_DIRECCION(?)', [COD_DIRECCION],(err, rows, fields) => {
        if (!err) {
            res.status(200).json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Delete <-> DELETE eliminar DIRECCION

app.delete('/direcciones/:COD_DIRECCION', (req, res) => {
    const { COD_DIRECCION } = req.params;

    mysqlconnection.query('CALL EL_DIRECCION(?)', [COD_DIRECCION], (err, rows, fields) => {
        if (!err) {
            res.status(200).json({ message: 'Direccion eliminado exitosamente' });
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});