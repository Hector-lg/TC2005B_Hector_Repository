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
LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id
JOIN payment USING(rental_id)
GROUP BY film.title, category.name HAVING count(inventory.film_id) < 2
ORDER BY rental_id desc limit 30 ;

SELECT 
    film.title, 
    COUNT(DISTINCT inventory.inventory_id) AS copies_available,
    category.name AS category, 
    COUNT(DISTINCT CASE 
        WHEN rental.rental_date > DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) 
        THEN rental.rental_id 
        END) AS rentals_last_30_days,
    SUM(payment.amount) / film.replacement_cost AS profitability
FROM 
    film
    JOIN inventory USING(film_id)
    JOIN film_category USING(film_id)
    JOIN category USING(category_id)
    LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id
    LEFT JOIN payment ON rental.rental_id = payment.rental_id
GROUP BY 
    film.film_id, film.title, category.name, film.replacement_cost
HAVING 
    COUNT(DISTINCT inventory.inventory_id) < 2
ORDER BY 
    rentals_last_30_days DESC, profitability DESC
LIMIT 30;

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
GROUP BY c.name
order by duracion_promedio desc;


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

-- Ejemplo: Encontrar clientes que han alquilado películas de acción
SELECT customer_id, first_name, last_name
FROM customer
WHERE customer_id IN (
    SELECT DISTINCT r.customer_id
    FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    JOIN film f ON i.film_id = f.film_id
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    WHERE c.name = 'Action'
)
order by customer_id;


-- Ejemplo: Mostrar películas con su número de alquileres
SELECT 
    f.film_id,
    f.title,
    (SELECT COUNT(*) FROM rental r 
     JOIN inventory i ON r.inventory_id = i.inventory_id 
     WHERE i.film_id = f.film_id) AS total_rentals
FROM film f
ORDER BY total_rentals DESC;


-- Ejemplo: Top clientes por gastos y número de alquileres
SELECT r.customer_ranking, r.customer_id, r.revenue, 
       COUNT(rental.rental_id) AS rental_count
FROM (
    SELECT 
        customer_id, 
        SUM(amount) AS revenue,
        RANK() OVER (ORDER BY SUM(amount) DESC) AS customer_ranking
    FROM payment
    GROUP BY customer_id
) r
JOIN rental ON r.customer_id = rental.customer_id
WHERE r.customer_ranking <= 10
GROUP BY r.customer_ranking, r.customer_id, r.revenue
ORDER BY r.customer_ranking;

DELIMITER //
CREATE TRIGGER validate_rental_rate
BEFORE INSERT ON film
FOR EACH ROW
BEGIN
    -- Validar rango de precio
    IF NEW.rental_rate < 0.99 OR NEW.rental_rate > 6.99 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El precio de alquiler debe estar entre 0.99 y 6.99';
    END IF;
    
    -- Validar precio según clasificación
    IF NEW.rating = 'G' AND NEW.rental_rate > 3.99 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Las películas infantiles (G) no deben tener precio superior a 3.99';
    END IF;
END//
DELIMITER ;

SHOW COLUMNs from film;
INSERT INTO film (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features)
VALUES ("La guerra de los mundos", "Un viaje a marte", 2023, 1, 7, 5.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de Chihiro", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 1", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 2", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 3", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 4", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 5", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 6", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 7", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes"),
        ("El viaje de los sueños 8", "Un viaje a la luna", 2023, 1, 7, 2.99, 120, 19.99, "PG-13", "Deleted Scenes");


-- Last Update Timestamp: Create a trigger that automatically 
-- updates the last_update column to the current timestamp 
--whenever a record is updated in the customer table.

DELIMITER //
CREATE TRIGGER update_lastUpdate 
BEFORE UPDATE ON customer
FOR EACH ROW
BEGIN
    SET NEW.last_update = NOW();
END//
DELIMITER ;




