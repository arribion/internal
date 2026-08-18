SELECT column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' -- Change if using a custom schema
    AND table_name = 'portfolio_projects'
ORDER BY ordinal_position;