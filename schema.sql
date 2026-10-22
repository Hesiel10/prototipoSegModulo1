create table roles(id serial primary key, nombre text unique not null);
create table permisos(id serial primary key, codigo text unique not null);
create table roles_permisos(rol_id int references roles(id), permiso_id int references permisos(id), primary key(rol_id,permiso_id));
create table usuarios(id serial primary key, email text unique not null, nombre text not null, hash text not null,
  rol_id int not null references roles(id), activo boolean not null default true,
  intentos int not null default 0, bloqueado_hasta timestamptz, creado timestamptz default now());
create table bitacora_seguridad(id bigserial primary key, fecha timestamptz default now(), usuario text,
  accion text not null, resultado text not null, ip text, detalle text);
-- La bitácora es de solo escritura: nadie puede editar ni borrar eventos
create function bitacora_inmutable() returns trigger as $$ begin raise exception 'La bitácora no se puede modificar'; end $$ language plpgsql;
create trigger t_bitacora before update or delete on bitacora_seguridad for each row execute function bitacora_inmutable();

insert into roles(nombre) values ('Administrador'),('Agente de Ventas'),('Operador'),('Auditor');
insert into permisos(codigo) values ('usuarios:gestionar'),('bitacora:ver'),('catalogo:gestionar'),('reservas:gestionar'),('proveedores:gestionar'),('reportes:ver');
insert into roles_permisos(rol_id,permiso_id)
select r.id,p.id from (values
 ('Administrador','usuarios:gestionar'),('Administrador','catalogo:gestionar'),('Administrador','proveedores:gestionar'),('Administrador','reportes:ver'),
 ('Agente de Ventas','catalogo:gestionar'),('Agente de Ventas','reservas:gestionar'),('Agente de Ventas','reportes:ver'),
 ('Operador','reservas:gestionar'),('Operador','proveedores:gestionar'),
 ('Auditor','bitacora:ver')) v(r,p)
join roles r on r.nombre=v.r join permisos p on p.codigo=v.p;
