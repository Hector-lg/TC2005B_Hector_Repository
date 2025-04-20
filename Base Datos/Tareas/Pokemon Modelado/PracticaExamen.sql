-- Active: 1743624893182@@127.0.0.1@3306@sakila

SHOW COLUMNS FROM sakila.actor;
SELECT CONCAT(first_name, " ", last_name), actor_id 
from sakila.actor
order by actor_id
LIMIT 10;

-- mostrar el titulo de la pelicula su categoria y numero de alquileres acumulados por categoria
SHOW columns FROM sakila.film;
SHOW columns FROM sakila.category;
SHOW columns FROM sakila.film_category;

SHOW columns FROM sakila.rental

SELECT film.title, sakila.category.name, SUM(rental_id) AS rental_count
FROM sakila.film
JOIN sakila.inventory USING (film_id)
JOIN sakila.film_category using (film_id)
JOIN sakila.category using(category_id)
JOIN sakila.rental USING(inventory_id)
GROUP BY sakila.category.name;

SELECT 
    f.title,
    c.name AS category,
    COUNT(r.rental_id) OVER (PARTITION BY c.name) AS rentals_por_categoria
FROM film f
JOIN film_category fc ON f.film_id = fc.film_id
JOIN category c ON fc.category_id = c.category_id
JOIN inventory i ON f.film_id = i.film_id
JOIN rental r ON i.inventory_id = r.inventory_id
ORDER BY rentals_por_categoria DESC;

--usar una subconsulta para mostar lso clientes que han alquilado
-- una pelicula de categoria "Sci-Fi"

Select CONCAT (sakila.customer.first_name, " ", sakila.customer.last_name)
FROM customer
WHERE customer_id in (
    SELECT customer_id
    FROM rental
    Join customer USING (customer_id)
    join inventory using (inventory_id)
    join film_category USING(film_id)
    join category using (category_id)
    where name = "Sci-Fi"
    group by customer_id
);

-- promedio de dias entre alquiler  para cada cleinte
-- 

-- identificar los cuellos de botella usando explain de esta consulta
-- y optimizarla
explain SELECT c.name AS category, COUNT(r.rental_id) AS rentals
FROM category c
JOIN film_category fc ON c.category_id = fc.category_id
JOIN film f ON fc.film_id = f.film_id
JOIN inventory i ON f.film_id = i.film_id
JOIN rental r ON i.inventory_id = r.inventory_id
GROUP BY c.name;

select special_features from film;

/* Generar un reporte que muestre:
- peliculas con menos de dos copias disponibles
- su cateogoria
- numero de alquieres en los ultimos 30 dias
- rentabilidad (ingresos totales vs costo de remplazo)
*/

SELECT film.title, COUNT(inventory.film_id) AS copies_available, category.name, 
       COUNT(rental.rental_id) AS rentals_last_30_days, 
       SUM(payment.amount) / film.replacement_cost AS profitability
FROM film
JOIN inventory USING(film_id)
JOIN film_category USING(film_id)
JOIN category USING(category_id)
LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id AND rental.rental_date >= NOW() - INTERVAL 30 DAY
JOIN payment USING(rental_id)
GROUP BY film.film_id, category.name
HAVING COUNT(inventory.film_id) < 2;

SELECT CONCAT(first_name, " ", last_name) as Customer_name, customer_id, SUM(amount) AS total_gastado
FROM payment
INNER JOIN customer USING(customer_id)
GROUP BY customer_id
HAVING SUM(amount) > 100; -- Clientes que gastaron más de $100.

SHOW columns from film;

SELECT
    c.name as categoria,
    count(fc.film_id) as total_peliculas,
    avg(f.length) as duracion_promedio
FROM film_category fc
JOIN film as f using(film_id)
JOIN category as c using(category_id)
GROUP BY c.name;


-- calcular el pago totla por cliente
-- y ordenarlos de mayor a menor
SELECT
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    SUM(p.amount) AS total_pagado
FROM customer c
JOIN payment p ON c.customer_id = p.customer_id
GROUP BY c.customer_id, customer_name
ORDER BY total_pagado DESC;

Select p.amount, c.customer_id
from customer c
join payment p on c.customer_id = p.customer_id;

SELECT
    cat.name AS category,
    COUNT(r.rental_id) AS total_rentas
FROM category cat
JOIN film_category fc ON cat.category_id = fc.category_id
JOIN film f ON fc.film_id = f.film_id
JOIN inventory i ON f.film_id = i.film_id
JOIN rental r ON i.inventory_id = r.inventory_id
GROUP BY cat.name
ORDER BY total_rentas DESC;

SELECT COUNT(C.film_id) as Numero_Peliculas,
SUM(C.rental_rate) as Ganancia_Renta_Peliculas,
ROUND(AVG(C.length),2) as Duracion_Promedio_Peliculas,
MIN(C.release_year) as Pelicula_Mas_Antigua,
MAX(C.release_year) as Pelicula_Mas_Nueva
FROM sakila.actor as A
INNER JOIN sakila.film_actor as B USING (actor_id)
INNER JOIN sakila.film as C USING (film_id);

USE sakila;
SELECT COUNT(last_name) AS Apellidos_Distintos
FROM sakila.actor WHERE last_name IN (
SELECT last_name
FROM sakila.actor
GROUP BY last_name
HAVING count(*) = 1
);