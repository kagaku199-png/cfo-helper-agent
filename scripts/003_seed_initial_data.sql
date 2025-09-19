-- Insert sample scenarios for demonstration
INSERT INTO scenarios (name, revenue, expenses, growth_rate, burn_rate, cash_on_hand) VALUES
  ('Conservative Growth', 100000.00, 80000.00, 5.00, 15000.00, 500000.00),
  ('Aggressive Expansion', 150000.00, 120000.00, 15.00, 25000.00, 300000.00),
  ('Steady State', 80000.00, 70000.00, 2.00, 10000.00, 750000.00)
ON CONFLICT DO NOTHING;
