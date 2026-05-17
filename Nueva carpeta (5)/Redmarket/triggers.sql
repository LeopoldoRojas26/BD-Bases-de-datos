-- =====================================================
-- TRIGGERS - Sprint 4
-- =====================================================

-- Trigger 1: Descontar stock al hacer una venta
CREATE OR REPLACE FUNCTION fn_descontar_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventario
    SET stock_actual = stock_actual - NEW.cantidad,
        ultima_actualizacion = CURRENT_TIMESTAMP
    WHERE id_producto = NEW.id_producto;

    IF (SELECT stock_actual FROM inventario 
        WHERE id_producto = NEW.id_producto) < 0 THEN
        RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.id_producto;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_descontar_stock
AFTER INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION fn_descontar_stock();

-- Trigger 2: Actualizar stock al recibir una orden de compra
CREATE OR REPLACE FUNCTION fn_actualizar_stock_compra()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado_orden = 'recibida' AND OLD.estado_orden <> 'recibida' THEN
        UPDATE inventario i
        SET stock_actual = stock_actual + doc.cantidad,
            ultima_actualizacion = CURRENT_TIMESTAMP
        FROM detalle_orden_compra doc
        WHERE doc.id_orden_compra = NEW.id_orden_compra
          AND i.id_producto = doc.id_producto;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_por_compra
AFTER UPDATE ON orden_compra
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_stock_compra();

-- Punto extra: Campo JSONB
ALTER TABLE producto ADD COLUMN IF NOT EXISTS atributos_extra JSONB;

UPDATE producto SET atributos_extra = '{"peso_kg": 1.0, "unidad": "bolsa", "origen": "México"}' WHERE id_producto = 1;
UPDATE producto SET atributos_extra = '{"volumen_litros": 1.0, "refrigeracion": true, "origen": "México"}' WHERE id_producto = 2;
UPDATE producto SET atributos_extra = '{"peso_kg": 0.68, "rebanadas": 20, "origen": "México"}' WHERE id_producto = 3;
UPDATE producto SET atributos_extra = '{"peso_kg": 1.0, "tipo": "fresca", "sin_hueso": true}' WHERE id_producto = 4;
UPDATE producto SET atributos_extra = '{"peso_kg": 1.0, "variedad": "Red Delicious", "origen": "importada"}' WHERE id_producto = 5;