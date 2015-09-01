/*******************************************************************************
* C interface to libnet
            irg_int0(const char* shortopts, const char* longopts, const char* datatype, const char* glossary)
*    USAGE:
*        prob-net [--learning] [--inference]
* 
*******************************************************************************/
//for inimini
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include "../minini/minIni.h"
#define sizearray(a)  (sizeof(a) / sizeof((a)[0]))

//for checking to see if file is readable
#include <unistd.h>

//readline
#include <readline/readline.h>
#include <readline/history.h>

#include "net.h"
#include "main.h"

#include "../include/argtable3.h"

#define TRUE		1
#define	FALSE		0
#define FILENAME_MAX	100

int non_interactive_command(int em_max_iterations, int em_number_of_training_samples, double em_log_likelihood_change_limit, int number_of_states, const char *ini_filename, int g_count, int l_count, int i_count) {

    char value[200];
    int MAP_flag = 1;

    char pairwise_filepath[200];
    char pathway_filepath[200];
    char observed_data_filepath[200];
    char pairwise_interactions_filepath[200];
    char hyperparameters_filepath[200];
    char estimated_parameters_filepath[200];
    char posterior_probabilities_filepath[200];

    ini_gets("files", "pairwise", "dummy", pairwise_filepath, sizearray(value), ini_filename);
    ini_gets("files", "pathway", "dummy", pathway_filepath, sizearray(value), ini_filename);
    ini_gets("files", "observed_data", "dummy", observed_data_filepath, sizearray(value), ini_filename);
    ini_gets("files", "pairwise_interactions", "dummy", pairwise_interactions_filepath, sizearray(value), ini_filename);
    ini_gets("files", "hyperparameters", "dummy", hyperparameters_filepath, sizearray(value), ini_filename);
    ini_gets("files", "estimated_parameters", "dummy", estimated_parameters_filepath, sizearray(value), ini_filename);
    ini_gets("files", "posterior_probabilities", "dummy", posterior_probabilities_filepath, sizearray(value), ini_filename);

    if (g_count > 0) {
        printf("Generating factorgraph with number of states %d\n", number_of_states);

        if ( strcmp(pathway_filepath, "dummy") == 0 ) {
            printf("Pathway filepath not specified in config\n");
            return 1;
        }
        if ( strcmp(pairwise_interactions_filepath, "dummy") == 0 ) {
            printf("Pairwise interactions filepath not specified in config\n");
            return 1;
        }

        int exit_code = reaction_logic_to_factorgraph(pairwise_interactions_filepath, pathway_filepath, number_of_states);

        if (exit_code != 0) {
           char * strerr = strerror(exit_code);
           printf("Failed to generate factorgraph (error code: %d): %s\n", exit_code, strerr);
           return exit_code;
        }
        else {
           printf("\tFactorgragh has been output into the following pathway file: %s\n", pathway_filepath); 
           printf("\tPathway generation completed\n\n");
        }
    }
    if (l_count > 0) {
        printf("Running Learning with Max iterations %d, number of states %d, and log likelilhood change limit %e\n", em_max_iterations, number_of_states, em_log_likelihood_change_limit);

        if ( strcmp(pathway_filepath, "dummy") == 0 ) {
            printf("Pathway filepath not specified in config\n");
            return 1;
        }
        if ( strcmp(observed_data_filepath, "dummy") == 0 ) {
            printf("Observed data filepath not specified in config\n");
            return 1;
        }
        if ( strcmp(estimated_parameters_filepath, "dummy") == 0 ) {
            printf("Estimated Parameters filepath not specified in config\n");
            return 1;
        }

        int exit_code = learning_discrete_BayNet(pathway_filepath, observed_data_filepath, estimated_parameters_filepath, number_of_states, em_max_iterations, em_log_likelihood_change_limit, MAP_flag);
        if (exit_code != 0) {
            char * strerr = strerror (exit_code);
            printf("Learning failed (error code: %d): %s\n", exit_code, *strerr);
            return 0;
        } 
        else {
            printf("\tEstimated Parameters habe been written to the following file: %s\n", estimated_parameters_filepath);
            printf("\tLearning completed\n\n");
        }
 
    }
    if (i_count > 0) {
        printf("Running Inference with number of states %d\n", number_of_states);

        if ( strcmp(pathway_filepath, "dummy") == 0 ) {
            printf("Pathway filepath not specified in config\n");
            return 1;
        }
        if ( strcmp(observed_data_filepath, "dummy") == 0 ) {
            printf("Observed data filepath not specified in config\n");
            return 1;
        }
        if ( strcmp(posterior_probabilities_filepath, "dummy") == 0 ) {
            printf("Posterior probabilities filepath not specified in config\n");
            return 1;
        }

        int exit_code = doLBPinference(pathway_filepath, observed_data_filepath, posterior_probabilities_filepath, number_of_states);
        if (exit_code != 0) {
             char * strerr = strerror (exit_code);
             printf("Inference failed with (error code: %d): %s\n", exit_code, *strerr);
             return exit_code;
        }
        else {
             printf("\tPosterior probabilities have been written to the following file: %s\n", posterior_probabilities_filepath);
             printf("\tInference completed\n");
        }
    }
    return 0;
}

void remove_newlines(char *s)
{
    char *nl = strrchr(s, '\n');
    if (nl!=NULL)
        *nl = '\0';
}

// Returns 1 for true an 0 for false
int is_yes(char * input) {
    if((strcmp(input,"yes") == 0) ||
       (strcmp(input,"YES") == 0) ||
       (strcmp(input,"Y") == 0) ||
       (strcmp(input,"y") == 0) ||
       (strcmp(input,"") == 0))
    {
        return TRUE;
    }

    return FALSE;
}

int get_pairwise_interaction_filepath(char ** filepath) {

    *filepath = readline("Enter pairwise interaction file:  ");
    add_history(*filepath);

    if (access(*filepath, R_OK) != 0) { //check if file is readable
       printf("Can not read specified file.\n");
       return get_pairwise_interaction_filepath(filepath);
    }

    return 0;
}


int interactive_command() {
   char *input; 
   char *pairwise_interaction_filepath = "";
   double result = 0;

   input = readline("Would you like to generate factorgraph from pairwise interactions [Y/n] ");

   if (is_yes(input) == 1)
   {
       printf("\nGathering information to generated the factorgraph file from pairwise interactions\n");
       get_pairwise_interaction_filepath(&pairwise_interaction_filepath);
   } 
   else 
   {
       printf("You have selected no\n");
   }

   return 0;
}

int interactive_commands() {
    char *inpt;

    int i = 0;

    while ( i < 10 )
    {
        inpt = readline("Enter text: ");
        add_history(inpt);
        printf("%s", inpt);
        printf("\n");
        ++i;
    }

}

int main(int argc, char *argv[]) {
    struct arg_lit *i, *l, *g, *interactive;
    struct arg_lit *help, *version;
    struct arg_end *end;
    struct arg_int *em_max_iterations, *em_number_of_training_samples, *number_of_states;
    struct arg_file *inifile;
    struct arg_dbl *em_log_likelihood_change_limit; 

    void *argtable[] = {
        interactive = arg_lit0(NULL, "interactive", "Interactive mode"),
        inifile = arg_file0("f", "inifile", "inifile", "File to be use to describe configuration of analysis"),
        g = arg_lit0("g", "generate-pathway", "Generate factorgraph from reaction logic"),
        i = arg_lit0("i", "inference", "Run inference on dataset"),
        l = arg_lit0("l", "learning", "Run learning on dataset"),
        number_of_states = arg_int0("ns", "number-of-states", NULL, "Number of states for pathway (default is 3)"),
        em_max_iterations = arg_int0("k", "em-max-iterations", NULL , "Maximum number of iterations for expectation maximization (default is 4000)"),
        em_number_of_training_samples = arg_int0("ts", "training-samples", NULL, "Number of training samples used in expectation mimization (default 400)"),
        em_log_likelihood_change_limit = arg_dbl0("cl", "log-likelihood-change-limit", NULL, "Loglikeliihood change limit for expectation maximization (default 1e-3)"),
        help = arg_lit0(NULL,"help", "Display help and exit"),
        version = arg_lit0(NULL,"version", "Display version information and exit"),
        end = arg_end(20)
    };
 
    const char *program_name = "prob-net";
    const char *program_version = "1.0.0";

    int exitcode = 0;
    int nerrors;

    /* set any command line default values prior to parsing */
    em_max_iterations->ival[0] = 4000;
    em_number_of_training_samples->ival[0] = 400;
    em_log_likelihood_change_limit->dval[0] = 1e-3;
    number_of_states->ival[0] = 3; 

    /* verify the argtable[] entries were allocated sucessfully */
    if (arg_nullcheck(argtable) != 0) {
        /* NULL entries were detected, some allocations must have failed */
        printf("%s: insufficient memory\n", program_name);
        exitcode = 1;
        goto exit;
    }

    /* Parse the command line as defined by argtable[] */
    nerrors = arg_parse(argc,argv,argtable);

    /* special case: '--help' takes precedence over error reporting */
    if ( (help->count > 0) || (argc == 1) ) {
        printf("Usage: %s", program_name);
        arg_print_syntax(stdout,argtable,"\n");
        printf("Perform inference and learning on probabilistic networks.\n");
        arg_print_glossary(stdout,argtable," %-25s %s\n");
        printf("\nSupply paths of files in prob-net.cfg configuration file.\n\n"
        "Report bugs to <adam.j.wright82@gmail.com>.\n");
        exitcode = 0;
        goto exit;
    }

    /* special case: '--version' takes precedence error reporting */
    if (version->count > 0) {
        printf("'%s' for performing inference and learning on probability networks.\nVersion %s\n", program_name, program_version);
        printf("January 2015, Hossein Radfar and Adam Wright\n");  
        exitcode = 0;
        goto exit;
    }

    /* If the parser returned any errors then display them and exit */
    if (nerrors > 0) {
        /* Display the error details contained in the arg_end struct.*/
        arg_print_errors(stdout, end, program_name);
        printf("Try '%s --help' for more information.\n",program_name);
        exitcode = 1;
        goto exit;
    }

    if(interactive->count > 0) {
        printf("Starting Interactive Mode\n>>");
        interactive_command();
        goto exit;
    }

    if( access( *inifile->filename, F_OK ) == -1 ) {
        arg_print_errors(stdout, end, program_name);
        printf("Either the inifile specified is unreadable or was not specified: %s\n", *inifile->filename);
        exitcode = 2;
        goto exit;
    }

    /* Command line parsing is complete, do the main processing */
    exitcode = non_interactive_command(em_max_iterations->ival[0], em_number_of_training_samples->ival[0], em_log_likelihood_change_limit->dval[0], number_of_states->ival[0], *inifile->filename, g->count, l->count, i->count);
exit:
    /* deallocate each non-null entry in argtable[] */
    arg_freetable(argtable,sizeof(argtable)/sizeof(argtable[0]));  

    return exitcode;
}
