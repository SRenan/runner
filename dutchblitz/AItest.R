#' Convert data frame to VCF format
#' @param df data frame with columns CHROM, POS, REF, ALT, QUAL
#' @param output_file path to output VCF file
#' @param sample_name name of the sample (default: "SAMPLE")
#' @return NULL, writes VCF file to disk
#' @export
write_vcf <- function(df, output_file, sample_name = "SAMPLE") {
  # Check required columns
  required_cols <- c("CHROM", "POS", "REF", "ALT", "QUAL")
  if (!all(required_cols %in% names(df))) {
    stop("Data frame must contain columns: ", paste(required_cols, collapse = ", "))
  }
  
  # Create VCF header
  vcf_header <- c(
    "##fileformat=VCFv4.2",
    "##fileDate=", format(Sys.time(), "%Y%m%d"),
    "##source=write_vcf_function",
    "##reference=unknown",
    "##contig=<ID=1,length=1000000>",
    paste0("#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\t", sample_name)
  )
  
  # Prepare data for VCF format
  # Add missing required columns with default values
  df$ID <- "."  # No ID information
  df$FILTER <- "PASS"  # All variants pass filtering
  df$INFO <- "."  # No additional information
  df$FORMAT <- "GT"  # Only genotype format
  df$GT <- "0/1"  # Default heterozygous genotype
  
  # Reorder columns according to VCF format
  vcf_cols <- c("CHROM", "POS", "ID", "REF", "ALT", "QUAL", "FILTER", "INFO", "FORMAT", "GT")
  df_vcf <- df[, vcf_cols]
  
  # Write to file
  con <- file(output_file, "w")
  writeLines(vcf_header, con)
  write.table(df_vcf, con, sep = "\t", row.names = FALSE, quote = FALSE)
  close(con)
  
  message("VCF file written to: ", output_file)
  return(invisible(NULL))
}

# Example usage:
# df <- data.frame(
#   CHROM = c("1", "1", "2"),
#   POS = c(100, 200, 300),
#   REF = c("A", "C", "G"),
#   ALT = c("T", "G", "A"),
#   QUAL = c(100, 200, 300)
# )
# write_vcf(df, "output.vcf")
