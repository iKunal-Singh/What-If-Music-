
-- Function to increment download counts for items
CREATE OR REPLACE FUNCTION increment_downloads(item_id UUID, table_name TEXT)
RETURNS void AS $$
BEGIN
    IF table_name = 'beats' THEN
        UPDATE beats SET downloads = downloads + 1 WHERE id = item_id;
    ELSIF table_name = 'remixes' THEN
        UPDATE remixes SET downloads = downloads + 1 WHERE id = item_id;
    ELSIF table_name = 'cover_art' THEN
        UPDATE cover_art SET downloads = downloads + 1 WHERE id = item_id;
    ELSE
        RAISE EXCEPTION 'Invalid table name: %', table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;
