Add-Type -AssemblyName System.Drawing
$assetDir = Join-Path $PSScriptRoot '../public/static/editorial/mei-2026-2028'
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null
$slides = @(
 @{K='MEI · PLANEJAMENTO'; T="O que muda em`n2027 e 2028?"; B='Mais espaço para crescer. Mais atenção aos números.'},
 @{K='01 / NOVOS LIMITES'; T="2026: R$ 81 mil`n2027: R$ 110 mil`n2028: R$ 140 mil"; B='O limite futuro não vale antecipadamente para 2026. Valores anuais para o MEI em geral.'},
 @{K='02 / NÃO CONFUNDA'; T="Faturamento`nnão é lucro."; B='E a referência mensal de faturamento não é o valor do DAS.'},
 @{K='03 / EQUIPE MAIOR'; T="Até dois`nempregados`na partir de 2027."; B='Antes de contratar, calcule o custo completo e o impacto no caixa.'},
 @{K='04 / DÍVIDAS'; T="O perdão não`nabrange toda`ndívida do negócio."; B='Confira quais débitos federais se enquadram e mantenha suas obrigações em dia.'},
 @{K='05 / SEU PRÓXIMO PASSO'; T="Controle as receitas.`nRevise os preços.`nProjete o caixa."; B='Planeje a contratação e acompanhe o resultado — não apenas as vendas.'},
 @{K='CRESÇA COM SEGURANÇA'; T="O teto pode`naumentar. Seu lucro`nprecisa acompanhar."; B='Jorge Telles · Gestão financeira. Leia o artigo completo em jorgetelles.com.br.'}
)
$purple=[Drawing.ColorTranslator]::FromHtml('#420b68')
$pink=[Drawing.ColorTranslator]::FromHtml('#f50078')
$muted=[Drawing.ColorTranslator]::FromHtml('#6c587d')
for($i=0;$i -lt $slides.Count;$i++) {
 $bitmap=New-Object Drawing.Bitmap 1080,1350
 $g=[Drawing.Graphics]::FromImage($bitmap)
 $g.SmoothingMode='AntiAlias'; $g.TextRenderingHint='AntiAliasGridFit'
 $g.Clear([Drawing.ColorTranslator]::FromHtml('#f7f2fc'))
 $brush=New-Object Drawing.SolidBrush $purple
 $accent=New-Object Drawing.SolidBrush $pink
 $secondary=New-Object Drawing.SolidBrush $muted
 $g.FillRectangle($accent,0,0,1080,18)
 $brand=New-Object Drawing.Font 'Segoe UI',27,([Drawing.FontStyle]::Bold)
 $label=New-Object Drawing.Font 'Segoe UI',21,([Drawing.FontStyle]::Bold)
 $title=New-Object Drawing.Font 'Segoe UI',55,([Drawing.FontStyle]::Bold)
 $body=New-Object Drawing.Font 'Segoe UI',30
 $foot=New-Object Drawing.Font 'Segoe UI',18
 $g.DrawString('JT.  Jorge Telles',$brand,$brush,72,70)
 $g.DrawString($slides[$i].K,$label,$accent,72,245)
 $g.DrawString($slides[$i].T,$title,$brush,(New-Object Drawing.RectangleF 68,335,950,495))
 $g.FillRectangle($accent,72,850,100,7)
 $g.DrawString($slides[$i].B,$body,$secondary,(New-Object Drawing.RectangleF 72,905,930,250))
 $g.DrawString('FONTES OFICIAIS · LC 238/2026 · PGFN · 12/11/2026',$foot,$secondary,72,1215)
 $g.DrawString(('{0:D2} / 07' -f ($i+1)),$foot,$brush,900,1270)
 $bitmap.Save((Join-Path $assetDir ('slide-{0:D2}.png' -f ($i+1))),[Drawing.Imaging.ImageFormat]::Png)
 $g.Dispose();$bitmap.Dispose();$brush.Dispose();$accent.Dispose();$secondary.Dispose()
 foreach($font in @($brand,$label,$title,$body,$foot)) {$font.Dispose()}
}
Write-Output ('Carrossel gerado: '+$assetDir)
