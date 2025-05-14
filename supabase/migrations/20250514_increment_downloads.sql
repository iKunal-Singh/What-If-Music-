
-- Function to increment download counts
CREATE OR REPLACE FUNCTION increment_downloads(item_id UUID, table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('UPDATE %I SET downloads = downloads + 1 WHERE id = %L', table_name, item_id);
END;
$$;
