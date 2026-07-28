-- Adicionar coluna is_available para controle de disponibilidade pontual ("Esgotado hoje")
-- Diferente de is_active (que esconde o produto do catálogo), is_available apenas bloqueia a compra
-- mas mantém o produto visível na vitrine.
ALTER TABLE products ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT true;
