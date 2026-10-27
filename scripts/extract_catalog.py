import os
import json
import subprocess

os.makedirs('public/products/catalog', exist_ok=True)
os.makedirs('public/brands', exist_ok=True)

# List of all products per page: (code, name, brand, category, priceDT, dlc, packing, isPerKg)
# If a page has N items, they are vertically distributed between y=450 and y=2600
pages_data = [
    # Page 1
    (1, "Paysan Breton", "Fromages", [
        ("7001", "Crème Briquette 20Cl", 10.500, "DLC 200 Jours", "24 Pièces par carton", False),
        ("7002", "Crème UHT 35.2% 1L", 39.000, "DLC 180 Jours", "12 Pièces par carton", False),
        ("7003", "Spécial Gratin râpé 200Gr", 21.280, "DLC 120 Jours", "25 Pièces par carton", False),
        ("7004", "Emmental râpé 100Gr", 10.220, "DLC 120 Jours", "50 Pièces par carton", False),
        ("7006", "Emmental Portion 220Gr", 23.470, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7007", "Camembert 250Gr", 21.700, "DLC 55 Jours", "12 Pièces par carton", False),
    ]),
    # Page 2
    (2, "Paysan Breton", "Fromages", [
        ("7009", "Pointe de Brie 200Gr", 19.980, "DLC 45 Jours", "12 Pièces par carton", False),
        ("7010", "Mme Loïk Nature 150Gr", 15.750, "DLC 90 Jours", "8 Pièces par carton", False),
        ("7011", "Mme Loïk Ech / Cib 150Gr", 15.750, "DLC 90 Jours", "8 Pièces par carton", False),
        ("7016", "Mme Loïk AFH 150Gr", 15.750, "DLC 90 Jours", "8 Pièces par carton", False),
        ("7018", "Mme Loïk Saumon 150Gr", 15.750, "DLC 90 Jours", "8 Pièces par carton", False),
        ("7012", "Petit Moulé AFH 150Gr", 13.865, "DLC 90 Jours", "12 Pièces par carton", False),
    ]),
    # Page 3
    (3, "Paysan Breton", "Fromages", [
        ("7013", "Petit Moulé AFH 100Gr", 9.450, "DLC 120 Jours", "12 Pièces par carton (6 portions)", False),
        ("7014", "Petit Moulé Nature 150Gr", 13.540, "DLC 90 Jours", "12 Pièces par carton", False),
        ("7015", "Petit Moulé Nature 100Gr", 9.450, "DLC 90 Jours", "12 Pièces par carton", False),
        ("7020", "Bombe Chantilly 250Gr", 19.200, "DLC 240 Jours", "12 Pièces par carton", False),
        ("7025", "Brique Tradition 180Gr", 18.980, "DLC 33 Jours", "8 Pièces par carton", False),
        ("7027", "Emmental Râpé 200Gr", 18.880, "DLC 120 Jours", "24 Pièces par carton", False),
    ]),
    # Page 4
    (4, "Paysan Breton", "Fromages", [
        ("7045", "Emmental Even 220Gr", 19.830, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7048", "B. Chèvre Cendrée 100Gr", 14.430, "DLC 120 Jours", "6 Pièces par carton", False),
        ("7049", "B. Chèvre Poivre 100Gr", 15.905, "DLC 120 Jours", "6 Pièces par carton", False),
        ("7075", "Bûche de Chèvre Nature", 105.000, "DLC 180 Jours", "1 Pièce par carton", True),
        ("7051", "Brie Tarte 60% 3,3Kg", 83.620, "DLC 82 Jours", "1 Pièce par carton", False),
    ]),
    # Page 5
    (5, "Zanetti", "Fromages", [
        ("7100", "Grana Padano 1/16", 99.000, "DLC 180 Jours", "1 Pièce par carton", True),
        ("7102", "Grana Padano Gratt. 100Gr", 13.300, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7104", "Grana Padano AOP 150Gr", 20.900, "DLC 180 Jours", "20 Pièces par carton", False),
        ("7105", "Gorgonzola DOP 150Gr", 16.800, "DLC 75 Jours", "12 Pièces par carton", False),
        ("7106", "Parmigiano Reggiano 150Gr", 27.020, "DLC 180 Jours", "12 Pièces par carton", False),
        ("7111", "P. Reggiano Copeaux 150Gr", 16.700, "DLC 120 Jours", "12 Pièces par carton", False),
    ]),
    # Page 6
    (6, "Zanetti", "Fromages", [
        ("7112", "Parmigiano Reggiano 35Kg", 125.000, "DLC 360 Jours", "1 Pièce par carton", True),
        ("7113", "Emilgrana 35Kg", 69.000, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7115", "P. Reggiano 250Gr", 182.360, "DLC 180 Jours", "5 Pièces par carton", False),
        ("7116", "Grana Padano 250Gr", 139.000, "DLC 180 Jours", "6 Pièces par carton", False),
        ("7132", "Granello 100Gr", 8.440, "DLC 90 Jours", "20 Pièces par carton", False),
        ("7150", "Gorgonzola D.O.P 1/8", 91.400, "DLC 90 Jours", "1 Pièce par carton", True),
    ]),
    # Page 7
    (7, "Zanetti", "Fromages", [
        ("7153", "Mascarpone Zanetti 250Gr", 14.980, "DLC 110 Jours", "12 Pièces par carton", False),
        ("7172", "Ricotta 250Gr", 10.590, "DLC 30 Jours", "6 Pièces par carton", False),
        ("7173", "Mozzarella Di Buffala 125Gr", 15.000, "DLC 30 Jours", "12 Pièces par carton", False),
        ("7176", "Pecorino Romano R. 100Gr", 17.370, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7184", "Parmigiano R. Râpé 100Gr", 15.100, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7188", "Grana Padano Fresh Grated", 6.780, "DLC 120 Jours", "20 Pièces par carton", False),
    ]),
    # Page 8
    (8, "Zanetti", "Fromages", [
        ("7189", "Granello 80Gr", 6.800, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7190", "Parmiggiano Reggiano 40 GR", 6.280, "DLC 120 Jours", "20 Pièces par carton", False),
        ("7192", "Buratta 100 GR", 11.430, "DLC 30 Jours", "8 Pièces par carton", False),
    ]),
    # Page 9
    (9, "Old Amsterdam", "Fromages", [
        ("7C26", "Demi-Meul Old Amsterdam", 110.500, "DLC 270 Jours", "2 Pièces par carton", True),
        ("7C28", "Old Amsterdam Portion 150 GR", 25.483, "DLC 270 Jours", "12 Pièces par carton", True),
        ("7C29", "Old Amsterdam Snacks 90 GR", 23.783, "DLC 275 Jours", "8 Pièces par carton", True),
    ]),
    # Page 10
    (10, "Veldhuyzen", "Fromages", [
        ("7C02", "Maasdam Holland 13 KG", 65.000, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C12", "Edam Ball Veldhuyzen", 76.000, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C13", "Gouda Cheese Veldhuyzen", 65.600, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C09", "Gouda Cumin Veldhuyzen 4,5 KG", 69.000, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C23", "Emmental Loaf Veldhuyzen 3KG", 66.400, "DLC 365 Jours", "3 Pièces par carton", True),
    ]),
    # Page 11
    (11, "Hommage", "Fromages", [
        ("7C25", "Hommage Mild 4KG", 88.500, "DLC 365 Jours", "1 Pièce par carton", True),
    ]),
    # Page 12
    (12, "Basiron", "Fromages", [
        ("7C15", "Gouda Pesto Verde 4,5Kg", 89.900, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C16", "Gouda Pesto Rosso 4,5Kg", 83.900, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C17", "Gouda Truffe 4,5Kg", 99.980, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C18", "Gouda Walnut 4,5Kg", 86.900, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C19", "Gouda Mustard 4,5Kg", 81.500, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C20", "Gouda Pepper 4,5Kg", 77.900, "DLC 365 Jours", "1 Pièce par carton", True),
    ]),
    # Page 13
    (13, "Basiron", "Fromages", [
        ("7C21", "Gouda Hot Chilli 4,5Kg", 74.980, "DLC 365 Jours", "1 Pièce par carton", True),
        ("7C22", "Gouda Zaatar 4,5Kg", 80.990, "DLC 365 Jours", "1 Pièce par carton", True),
    ]),
    # Page 14
    (14, "Mammen", "Fromages", [
        ("7M00", "Mammen Danablu 50+ 3kG", 82.000, "DLC 360 Jours", "3 Pièces par carton", True),
        ("7M01", "Dana Blue Cheese 50+ 100 GR", 10.836, "DLC 360 Jours", "10 Pièces par carton", True),
    ]),
    # Page 15
    (15, "Ile de France / Caprice", "Fromages", [
        ("7605", "Apérifrais Côte d'Azur", 16.520, "DLC 95 Jours", "12 Pièces par carton", False, "Ile de France"),
        ("7618", "Papillon Roquefort 100Gr", 20.920, "DLC 110 Jours", "12 Pièces par carton", False, "Papillon"),
        ("7610", "Caprice des Dieux 200Gr", 24.110, "DLC 46 Jours", "24 Pièces par carton", False, "Caprice des Dieux"),
        ("7624", "Caprice des Dieux 125Gr", 15.340, "DLC 46 Jours", "8 Pièces par carton", False, "Caprice des Dieux"),
        ("7612", "Cœur De Lion Camembert 250Gr", 23.740, "DLC 58 Jours", "12 Pièces par carton", False, "Cœur de Lion"),
    ]),
    # Page 16
    (16, "Maison Savencia", "Fromages", [
        ("7619", "St Agur Portion 125Gr", 18.110, "DLC 55 Jours", "7 Pièces par carton", False, "Saint Agur"),
        ("7620", "Fol Epi Allégé TR 150Gr", 20.757, "DLC 120 Jours", "8 Pièces par carton", False, "Fol Epi"),
        ("7621", "Fol Epi Classic TR 150Gr", 20.200, "DLC 120 Jours", "8 Pièces par carton", False, "Fol Epi"),
        ("7650", "Chaumes", 105.813, "DLC 56 Jours", "1 Pièce par carton", True, "Chaumes"),
        ("7651", "St Albray", 105.813, "DLC 55 Jours", "1 Pièce par carton", True, "Saint Albray"),
        ("7652", "Vieux Pané", 105.813, "DLC 58 Jours", "1 Pièce par carton", True, "Vieux Pané"),
    ]),
    # Page 17
    (17, "Entremont", "Fromages", [
        ("7906", "Tendre Dégustation 250Gr", 23.340, "DLC 90 Jours", "12 Pièces par carton", False),
        ("7909", "Comte Extra 200Gr", 29.900, "DLC 90 Jours", "15 Pièces par carton", False),
        ("7913", "TR Emmental 150Gr", 16.350, "DLC 120 Jours", "12 Pièces par carton", False),
        ("7914", "TR Edam 150Gr", 16.260, "DLC 90 Jours", "12 Pièces par carton", False),
        ("7915", "TR Gouda 150Gr", 16.260, "DLC 90 Jours", "12 Pièces par carton", False),
        ("7917", "TR Dégustation 150Gr", 16.450, "DLC 90 Jours", "8 Pièces par carton", False),
    ]),
    # Page 18
    (18, "Entremont", "Fromages", [
        ("7922", "Raclette Entremont 250GR", 23.630, "DLC 60 Jours", "6 Pièces par carton", False),
        ("7923", "Raclette Entremont 400GR", 34.590, "DLC 60 Jours", "6 Pièces par carton", False),
        ("7650B", "Comte Extra Doux AOP", 120.000, "DLC 90 Jours", "1 Pièce par carton", True),
        ("7651B", "Comte Extra Fruité AOP", 130.000, "DLC 90 Jours", "1 Pièce par carton", True),
        ("7652B", "Comte Vieille Réserve", 142.000, "DLC 90 Jours", "1 Pièce par carton", True),
        ("7953", "Beaufort AOP", 176.000, "DLC 90 Jours", "1 Pièce par carton", True),
    ]),
    # Page 19
    (19, "Entremont", "Fromages", [
        ("7954", "Raclette de Saison 7Kg", 77.200, "DLC 60 Jours", "1 Pièce par carton", True),
        ("7965", "Emmental Toast 2,11 KG", 76.000, "DLC 60 Jours", "1 Pièce par carton", True),
        ("7969", "Raclette Carré 48%", 76.000, "DLC 60 Jours", "1 Pièce par carton", True),
    ]),
    # Page 20
    (20, "Soignon", "Fromages", [
        ("7J00", "Bûche de Chèvre 1Kg", 112.600, "DLC 115 Jours", "1 Pièce par carton", True),
        ("7J01", "St Maure Soignon 180Gr", 23.730, "DLC 53 Jours", "6 Pièces par carton", False),
        ("7J03", "Buchette de chèvre Miel 125Gr", 17.650, "DLC 90 Jours", "24 Pièces par carton", False),
        ("7J06", "Crottin de chèvre 40Gr", 5.560, "DLC 90 Jours", "24 Pièces par carton", False),
        ("7J09", "Buchette de chèvre Nature 110Gr", 14.140, "DLC 160 Jours", "12 Pièces par carton", False),
        ("7J10", "Buchette de chèvre AFH 110Gr", 13.840, "DLC 160 Jours", "12 Pièces par carton", False),
    ]),
    # Page 21
    (21, "Soignon", "Fromages", [
        ("7J11", "Chèvre Pyramide Ciboulette 150Gr", 18.980, "DLC 160 Jours", "6 Pièces par carton", False),
        ("7J12", "Chèvre Pyramide Figues 150Gr", 18.980, "DLC 160 Jours", "6 Pièces par carton", False),
        ("7J13", "Chèvre Pyramide Miel 150Gr", 18.980, "DLC 160 Jours", "6 Pièces par carton", False),
        ("7J14", "Palet de chèvre Pané 4x25Gr", 16.650, "DLC 100 Jours", "12 Pièces par carton", False),
        ("7J19", "Chevre Pyramide Nature 150 GR", 18.160, "DLC 160 Jours", "12 Pièces par carton", False),
        ("7J20", "Chevre Pyramide AFH 150 GR", 18.980, "DLC 160 Jours", "12 Pièces par carton", False),
    ]),
    # Page 22
    (22, "Grand Fermage / Maestrella", "Fromages", [
        ("7J05", "Camembert Grand Fermage 125Gr", 13.340, "DLC 60 Jours", "12 Pièces par carton", False, "Grand Fermage"),
        ("7J17", "Mozza Nature 150Gr", 13.480, "DLC 90 Jours", "12 Pièces par carton", False, "Maestrella"),
        ("7J18", "Mozza Mix 150Gr", 14.090, "DLC 90 Jours", "12 Pièces par carton", False, "Maestrella"),
    ]),
    # Page 23
    (23, "Sotulaifrom", "Fromages", [
        ("7N01", "Barbarin Brebis 250 Gr", 16.888, "DLC 60 Jours", "16 Pièces par carton", False),
        ("7N02", "Numidia 60 Gr", 4.400, "DLC 160 Jours", "20 Pièces par carton", False),
        ("7N04", "Carre De Mateur Vache 170Gr", 8.935, "DLC 45 Jours", "24 Pièces par carton", False),
        ("7N05", "Camembert Rondelait 250Gr", 13.261, "DLC 60 Jours", "20 Pièces par carton", False),
        ("7N06", "Camembert Rondelait 150Gr", 7.950, "DLC 60 Jours", "20 Pièces par carton", False),
        ("7N08", "Fleuron Bleu 150 Gr", 10.030, "DLC 180 Jours", "4 Pièces par carton", False),
    ]),
    # Page 24
    (24, "Sotulaifrom", "Fromages", [
        ("7N50", "Numidia 2,5 KG", 64.863, "DLC 160 Jours", "4 Pièces par carton", True),
        ("7N51", "Beja Brebis 2,4 KG", 68.924, "DLC 180 Jours", "4 Pièces par carton", True),
        ("7N52", "Amilka Brebis 4,5 KG", 66.924, "DLC 180 Jours", "2 Pièces par carton", True),
        ("7N53", "Fleur Des Champs 2KG", 51.561, "DLC 60 Jours", "2 Pièces par carton", True),
    ]),
    # Page 25
    (25, "Sterilgarda", "Fromages & Crèmes", [
        ("7L00", "Cooking Creme 200 ML", 6.700, "DLC 181 Jours", "24 Pièces par carton", False),
        ("7L01", "Whipping Cream 200ML", 8.500, "DLC 243 Jours", "24 Pièces par carton", False),
        ("7L02", "Mascarpone UHT 200 GR", 10.800, "DLC 243 Jours", "24 Pièces par carton", False),
    ]),
    # Page 26
    (26, "Volys Star", "Charcuterie Halal", [
        ("6103", "Bacon De Dinde", 74.840, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6104", "Suprême De Dinde", 75.400, "DLC 145 Jours", "1 Pièce par carton", True),
        ("6105", "Jambon de Dinde Premium", 87.920, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6106", "Suprême de Dinde au poivre vert", 94.740, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6107", "Filet de Dinde Premium", 96.700, "DLC 145 Jours", "1 Pièce par carton", True),
        ("6108", "Jambon de Dinde Tradition", 99.320, "DLC 145 Jours", "1 Pièce par carton", True),
    ]),
    # Page 27
    (27, "Volys Star", "Charcuterie Halal", [
        ("6109", "Filet de Dinde Tradition", 99.220, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6110", "Filet de Dinde Fumé", 124.360, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6111", "Poitrine de Dinde Grillée", 129.870, "DLC 145 Jours", "1 Pièce par carton", False),
        ("6113", "Filet de Poulet Roti", 84.180, "DLC 145 Jours", "1 Pièce par carton", False),
    ]),
    # Page 28
    (28, "Mère Lalie", "Charcuterie Halal", [
        ("5207", "Véritable Terrine de Campagne Bretonne 180Gr", 12.064, "DLC 1 095 Jours", "12 Pièces par carton", False),
        ("5208", "Rillettes Fines de Bretagne 180Gr", 11.945, "DLC 1 095 Jours", "12 Pièces par carton", False),
        ("5209", "Terrine De Foie de Volaille 180Gr", 10.316, "DLC 1 095 Jours", "12 Pièces par carton", False),
        ("5210", "Terrine de Canard aux Poivres Verts 180Gr", 12.751, "DLC 1 095 Jours", "12 Pièces par carton", False),
        ("5211", "Terrine de Campagne Fines Herbes 180Gr", 11.336, "DLC 1 095 Jours", "12 Pièces par carton", False),
        ("5212", "Terrine de Lapin au Serpolet 180Gr", 12.751, "DLC 1 095 Jours", "12 Pièces par carton", False),
    ]),
    # Page 29
    (29, "Bastides", "Charcuterie de Porc", [
        ("5301", "Saucisson Sec supérieur 100Gr", 13.130, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5302", "Saucisson Sec Enrobé au poivre Blanc 80Gr", 13.090, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5303", "Chorizo Aux Piments d'Espagne 100Gr", 12.920, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5304", "Mortadelle d'Italie 100Gr", 11.720, "DLC 50 Jours", "20 Pièces par carton", False),
        ("5305", "Jambon Serrano 100Gr", 15.060, "DLC 90 Jours", "20 Pièces par carton", False),
    ]),
    # Page 30
    (30, "Bastides", "Charcuterie de Porc", [
        ("5306", "Salami Danois 100Gr", 11.270, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5308", "Bacon Fumé 100Gr", 12.080, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5310", "Saucisse Sèche Supérieur Droite 250Gr", 27.450, "DLC 90 Jours", "10 Pièces par carton", False),
        ("5312", "Coppa 100Gr", 14.260, "DLC 90 Jours", "20 Pièces par carton", False),
        ("5314", "Plateau Tapas 160Gr", 23.890, "DLC 90 Jours", "10 Pièces par carton", False),
    ]),
    # Page 31
    (31, "Bastides", "Charcuterie de Porc", [
        ("5316", "Mini Rosette 300Gr", 34.590, "DLC 50 Jours", "10 Pièces par carton", False),
        ("5317", "Saucisson Sec Supérieur Nature 200Gr", 23.590, "DLC 75 Jours", "10 Pièces par carton", False),
        ("5330", "Jambon Serrano 160Gr", 22.960, "DLC 90 Jours", "10 Pièces par carton", False),
        ("5351", "Saucisson Sec Supérieur 1Kg", 93.600, "DLC 75 Jours", "1 Pièce par carton", True),
        ("5352", "Saucisson Sec Supérieur Enrobé aux Herbes 1Kg", 107.500, "DLC 75 Jours", "1 Pièce par carton", True),
    ]),
    # Page 32
    (32, "Bastides", "Charcuterie de Porc", [
        ("5353", "Saucisson Sec Supérieur Enrobé aux Poivres 1Kg", 108.000, "DLC 75 Jours", "1 Pièce par carton", True),
        ("5362", "Jambon De Bayonne IGP 9 Mois", 105.000, "DLC 75 Jours", "2 Pièces par carton", True),
        ("5365", "Bacon 2Kg", 63.600, "DLC 60 Jours", "1 Pièce par carton", True),
        ("5366", "Chorizo Doux Don Carlos 2Kg", 91.300, "DLC 60 Jours", "1 Pièce par carton", True),
        ("5372", "Grelots Nature 80Gr", 11.430, "DLC 90 Jours", "12 Pièces par carton", False),
        ("5373", "Grelots aux Noix 80Gr", 12.410, "DLC 90 Jours", "12 Pièces par carton", False),
    ]),
    # Page 33
    (33, "Bastides", "Charcuterie de Porc", [
        ("5374", "Grelots Roquefort 80Gr", 11.980, "DLC 90 Jours", "12 Pièces par carton", False),
        ("5375", "Grelots Chorizo 80Gr", 11.680, "DLC 90 Jours", "12 Pièces par carton", False),
    ]),
    # Page 34
    (34, "Jean Caby", "Charcuterie de Porc", [
        ("5903", "Jambon AC 4 Tranches 160Gr", 11.639, "DLC 50 Jours", "14 Pièces par carton", False),
        ("5904", "Jambon DD 4 Tranches 160Gr", 11.480, "DLC 50 Jours", "14 Pièces par carton", False),
        ("5905", "Lardon Fumés 200Gr", 12.052, "DLC 70 Jours", "20 Pièces par carton", False),
        ("5906", "Poitrine fumée TR 120Gr", 12.300, "DLC 70 Jours", "20 Pièces par carton", False),
        ("5950", "Jambon au torchon DD 8Kg", 55.800, "DLC 60 Jours", "1 Pièce par carton", True),
    ])
]

all_products = []

for page_num, default_brand, category, items in pages_data:
    page_img = f"public/pages/page_{page_num:02d}.jpg"
    n = len(items)
    
    # Crop brand logo from top right if first time
    brand_slug = default_brand.split('/')[0].strip().lower().replace(' ', '_')
    brand_logo_path = f"/brands/{brand_slug}.png"
    if not os.path.exists(f"public/brands/{brand_slug}.png"):
        subprocess.run([
            "convert", page_img,
            "-crop", "450x220+1180+150",
            f"public/brands/{brand_slug}.png"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Calculate y slots for items
    # In 1688x3000 page:
    # Content area is y: 440 to 2580 (total height ~2140)
    slot_h = 2140 / max(n, 1)
    
    for idx, item_tuple in enumerate(items):
        code = item_tuple[0]
        name = item_tuple[1]
        price = item_tuple[2]
        dlc = item_tuple[3]
        packing = item_tuple[4]
        is_per_kg = item_tuple[5]
        item_brand = item_tuple[6] if len(item_tuple) > 6 else default_brand
        
        y_center = 440 + (idx + 0.5) * slot_h
        y_top = int(max(400, y_center - 180))
        crop_h = 360
        crop_w = 420
        crop_x = 1200
        
        out_img = f"public/products/catalog/{code}.jpg"
        if not os.path.exists(out_img):
            subprocess.run([
                "convert", page_img,
                "-crop", f"{crop_w}x{crop_h}+{crop_x}+{y_top}",
                out_img
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
        all_products.append({
            "code": code,
            "name": name,
            "brand": item_brand,
            "category": category,
            "price": price,
            "priceFormatted": f"{price:,.3f}".replace(',', ' ').replace('.', ',') + " DT",
            "dlc": dlc,
            "packing": packing,
            "isPerKg": is_per_kg,
            "image": f"/products/catalog/{code}.jpg",
            "page": page_num
        })

print(f"Total extracted products: {len(all_products)}")

# Write to json
with open('src/data/smv_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(all_products, f, ensure_ascii=False, indent=2)

print("Saved src/data/smv_catalog.json")
